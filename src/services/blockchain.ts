import { ethers } from 'ethers';
import { Blockchain } from '../config';
import Character from './character';

const characterAddress = Blockchain.characterNFTAddress;
const provider = new ethers.providers.JsonRpcProvider(Blockchain.rpc);
const characterABI: ethers.ContractInterface = [
  'event NewBlockHeadCreated(address indexed owner, uint256 indexed tokenId)',
];

const main = async () => {
  console.log('Indexer Started');
  const readOnlyContract = new ethers.Contract(characterAddress, characterABI, provider);

  // listen to events
  readOnlyContract.on('NewBlockHeadCreated', (owner: string, tokenId: number) => {
    console.log(`NewBlockHeadCreated: ${owner} ${tokenId}`);
    // Create the metadata for the token and store to mongodb
    Character.generateCharacterMetaData(tokenId);
  });
};

main().catch(console.error);
