import { BigNumber, ethers, EventFilter, Event } from 'ethers';
import { Character as CharacterModel } from 'models/character';
import { Blockchain } from '../config';
import Character from './character';

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

  console.log(`Scraping block ${firstBlock} - ${firstBlock + 500}`);
  const blockLogs = await readOnlyContract.queryFilter(eventFilter, firstBlock, firstBlock + 500);

  return logScraper(readOnlyContract, eventFilter, firstBlock + 500, lastBlock, logs.concat(blockLogs));
};

const processToken = async (tokenIds: BigNumber[]): Promise<CharacterModel[]> => {
  const characters = [];

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < tokenIds.length; i++) {
    const tokenId = tokenIds[i];
    console.log(`Processing tokenId: ${tokenId}`);

    // eslint-disable-next-line no-await-in-loop
    const character = await Character.getCharacter(tokenId);
    if (character) {
      console.log(`Character already exists: ${character.tokenId}`);
      // eslint-disable-next-line no-continue
      continue;
    }

    // Create the metadata for the token
    console.log(`No Record of character: ${tokenId}`);
    // eslint-disable-next-line no-await-in-loop
    const newCharacter = await Character.generateCharacterMetaData(tokenId);
    characters.push(newCharacter);
  }

  return characters;
};

const main = async () => {
  console.log('Indexer Started');
  const readOnlyContract = new ethers.Contract(characterAddress, characterABI, provider);

  // crawl the smart contract and get all the tokenIds
  // const NewBlockHeadCreated = await readOnlyContract.interface.events.NewBlockHeadCreated;
  const eventFilter = readOnlyContract.filters.NewBlockHeadCreated();

  const firstBlock = 24995108;
  const lastBlock = 24998997;
  const logs = await logScraper(readOnlyContract, eventFilter, firstBlock, lastBlock, []);

  console.log(`Found ${logs.length} new block heads`);
  const tokenIds = logs.map(i => i.args?.tokenId);
  console.log(`Found ${tokenIds.length} new tokenIds`);
  console.log(tokenIds);

  // eslint-disable-next-line no-plusplus
  // for (let i = 0; i < logs.length; i++) {
  //   const log = logs[i];

  //   // eslint-disable-next-line prefer-destructuring
  //   const tokenId = log.args?.tokenId;
  //   console.log(`Processing tokenId: ${tokenId}`);

  const characters = await processToken(tokenIds);
  console.log(`Saving ${characters.length} new characters`);
  await Character.saveCharacters(characters);

  // }

  // listen to events
  readOnlyContract.on('NewBlockHeadCreated', (owner: string, tokenId: BigNumber) => {
    console.log(`NewBlockHeadCreated: ${owner} ${tokenId}`);
    // Create the metadata for the token and store to mongodb
    Character.generateCharacterMetaData(tokenId);
  });
};

main().catch(console.error);
