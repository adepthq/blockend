import { BigNumber, ethers, EventFilter, Event } from 'ethers';
import { MongoClient } from 'mongodb';
import { CharacterDocument, NewBlockHeadCreated } from '../models/character';
import { Blockchain } from '../config';
import Logger from '../lib/logger';
import Character from './characters';
import mongoclient from '../lib/mongoclient';

const characterAddress = Blockchain.characterNFTAddress;
const provider = new ethers.providers.JsonRpcProvider(Blockchain.rpc);
const characterABI: ethers.ContractInterface = [
  'event NewBlockHeadCreated(address indexed owner, uint256 indexed tokenId)',
];

const logScraper = async (
  readOnlyContract: ethers.Contract,
  eventFilter: EventFilter,
  firstBlock: number,
  lastBlock: number,
  logs: Array<Event>
): Promise<Array<Event>> => {
  if (firstBlock > lastBlock) {
    return logs;
  }

  Logger.info(`Scraping block ${firstBlock} - ${firstBlock + 500}`);
  const blockLogs = await readOnlyContract.queryFilter(eventFilter, firstBlock, firstBlock + 500);

  return logScraper(readOnlyContract, eventFilter, firstBlock + 500, lastBlock, logs.concat(blockLogs));
};

const processTokenRecursively = async (
  client: MongoClient,
  events: NewBlockHeadCreated[],
  characters: CharacterDocument[]
): Promise<CharacterDocument[]> => {
  if (events.length === 0) {
    return characters;
  }

  const event = events.pop();
  Logger.info(`Processing tokenId: ${event?.tokenId}`);

  if (!event?.tokenId) {
    return processTokenRecursively(client, events, characters);
  }

  const character = await Character.getCharacter(client, event.tokenId);
  if (character) {
    // eslint-disable-next-line no-underscore-dangle
    Logger.info(`Character already exists: ${character._id}`);
    return processTokenRecursively(client, events, characters);
  }

  // Create the metadata for the token
  Logger.info(`No Record of character: ${event.tokenId}`);
  Logger.info(`Generating Meta for Character: ${event.tokenId}`);

  const newCharacter = await Character.generateCharacterMetaData(event);
  characters.push(newCharacter);

  return processTokenRecursively(client, events, characters);
};

const syncDataFromBlockchain = async (client: MongoClient, readOnlyContract: ethers.Contract) => {
  const eventFilter = readOnlyContract.filters.NewBlockHeadCreated();

  const firstBlock = 24995108;
  const lastBlock = 25024320;
  const logs = await logScraper(readOnlyContract, eventFilter, firstBlock, lastBlock, []);

  Logger.info(`Found ${logs.length} new block heads`);
  const tokenIds = logs.map(i => ({ tokenId: i.args?.tokenId, owner: i.args?.owner }));

  const characters = await processTokenRecursively(client, tokenIds, []);

  if (characters.length > 0) {
    Logger.info(`Saving ${characters.length} new characters`);
    await Character.saveCharacters(client, characters);
  }
};

const generateNewCharacter = async (client: MongoClient, event: NewBlockHeadCreated) => {
  const newlyMintedCharacter = await Character.generateCharacterMetaData(event);
  await Character.saveCharacters(client, [newlyMintedCharacter]);
};

const main = async () => {
  Logger.info('Indexer Started');
  try {
    const client = await mongoclient.connect();
    const readOnlyContract = new ethers.Contract(characterAddress, characterABI, provider);

    // Sync the blockchain
    await syncDataFromBlockchain(client, readOnlyContract);

    // listen to events
    readOnlyContract.on('NewBlockHeadCreated', (owner: string, tokenId: BigNumber) => {
      Logger.info(`NewBlockHeadCreated: ${owner} ${tokenId}`);
      generateNewCharacter(client, {
        owner,
        tokenId,
      });
    });
  } catch (error) {
    Logger.error(error);
  } finally {
    mongoclient.disconnect();
  }
};

main().catch(console.error);
