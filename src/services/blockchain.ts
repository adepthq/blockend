import { BigNumber, ethers, EventFilter, Event } from 'ethers';
import { MongoClient } from 'mongodb';
import { Character as CharacterModel } from '../models/character';
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
  tokenIds: BigNumber[],
  characters: CharacterModel[]
): Promise<CharacterModel[]> => {
  if (tokenIds.length === 0) {
    return characters;
  }

  const tokenId = tokenIds.pop();
  Logger.info(`Processing tokenId: ${tokenId}`);

  if (!tokenId) {
    return processTokenRecursively(client, tokenIds, characters);
  }

  const character = await Character.getCharacter(client, tokenId);
  if (character) {
    Logger.info(`Character already exists: ${character.tokenId}`);
    return processTokenRecursively(client, tokenIds, characters);
  }

  // Create the metadata for the token
  Logger.info(`No Record of character: ${tokenId}`);
  Logger.info(`Generating Meta for Character: ${tokenId}`);

  const newCharacter = await Character.generateCharacterMetaData(tokenId);
  characters.push(newCharacter);

  return processTokenRecursively(client, tokenIds, characters);
};

const syncDataFromBlockchain = async (readOnlyContract: ethers.Contract) => {
  const eventFilter = readOnlyContract.filters.NewBlockHeadCreated();

  const firstBlock = 24995108;
  const lastBlock = 25024320;
  const logs = await logScraper(readOnlyContract, eventFilter, firstBlock, lastBlock, []);

  Logger.info(`Found ${logs.length} new block heads`);
  const tokenIds = logs.map(i => i.args?.tokenId);
  Logger.info(`Found ${tokenIds.length} new tokenIds`);

  try {
    const client = await mongoclient.connect();
    const characters = await processTokenRecursively(client, tokenIds, []);

    if (characters.length > 0) {
      Logger.info(`Saving ${characters.length} new characters`);
      await Character.saveCharacters(client, characters);
    }
  } catch (error) {
    Logger.error(error);
  } finally {
    mongoclient.disconnect();
  }
};

const generateNewCharacter = async (tokenId: BigNumber) => {
  try {
    const client = await mongoclient.connect();
    const newlyMintedCharacter = await Character.generateCharacterMetaData(tokenId);
    await Character.saveCharacters(client, [newlyMintedCharacter]);
  } catch (error) {
    Logger.error(error);
  } finally {
    mongoclient.disconnect();
  }
};

const main = async () => {
  Logger.info('Indexer Started');
  const readOnlyContract = new ethers.Contract(characterAddress, characterABI, provider);

  // Sync the blockchain
  await syncDataFromBlockchain(readOnlyContract);

  // listen to events
  readOnlyContract.on('NewBlockHeadCreated', (owner: string, tokenId: BigNumber) => {
    Logger.info(`NewBlockHeadCreated: ${owner} ${tokenId}`);
    generateNewCharacter(owner, tokenId);
  });
};

main().catch(console.error);
