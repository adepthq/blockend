export default {
  rpc: process.env.NODE_RPC || 'http://localhost:8545',
  characterNFTAddress: process.env.CHARACTER_NFT_ADDRESS || '0x0000000000000000000000000000000000000000',
  weaponNFTAddress: process.env.WEAPON_NFT_ADDRESS || '0x0000000000000000000000000000000000000000',
};
