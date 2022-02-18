import { BigNumber } from 'ethers';
import { ObjectId } from 'mongodb';

export enum CharacterType {
  Neutral = 'Neutral',
  Male = 'Male',
  Female = 'Female',
}

export enum CharacterRarity {
  Common = 'Common',
  Rare = 'Rare',
  Epic = 'Epic',
  Legend = 'Legend',
}

export enum CharacterClass {
  Cowboy = 'Cowboy',
  Robot = 'Robot',
  Zombie = 'Zombie',
  Knight = 'Knight',
  Shinobi = 'Shinobi',
}

export type CharacterStats = {
  vitality: number;
  strength: number;
  defense: number;
  morale: number;
  agility: number;
};

type StatsMinMax = {
  min: number;
  max: number;
};

export type CharacterStatsMinMax = {
  vitality: StatsMinMax;
  strength: StatsMinMax;
  defense: StatsMinMax;
  morale: StatsMinMax;
  agility: StatsMinMax;
};

type CharacterClassTree = {
  [key: string]: CharacterStatsMinMax;
};

type CharacterStatsTree = {
  [key: string]: CharacterClassTree;
};

export type NewBlockHeadCreated = {
  owner: string;
  tokenId: BigNumber;
};

export type CharacterDocument = {
  _id?: ObjectId;
  owner: string;
  tokenId: number;
  type: CharacterType[keyof CharacterType];
  rarity: CharacterRarity[keyof CharacterRarity];
  class: CharacterClass[keyof CharacterClass];
  stats: CharacterStats;
};

// max stat: 100
// min stat: 1
export const statsTree: CharacterStatsTree = {
  Common: {
    Cowboy: {
      vitality: { min: 3, max: 10 },
      strength: { min: 5, max: 10 },
      defense: { min: 2, max: 10 },
      morale: { min: 3, max: 10 },
      agility: { min: 3, max: 10 },
    },
    Shinobi: {
      vitality: { min: 2, max: 10 },
      strength: { min: 5, max: 10 },
      defense: { min: 3, max: 10 },
      morale: { min: 5, max: 10 },
      agility: { min: 7, max: 10 },
    },
    Robot: {
      vitality: { min: 5, max: 10 },
      strength: { min: 5, max: 10 },
      defense: { min: 5, max: 10 },
      morale: { min: 3, max: 10 },
      agility: { min: 4, max: 10 },
    },
    Zombie: {
      vitality: { min: 8, max: 10 },
      strength: { min: 5, max: 10 },
      defense: { min: 6, max: 10 },
      morale: { min: 3, max: 10 },
      agility: { min: 1, max: 10 },
    },
    Knight: {
      vitality: { min: 7, max: 10 },
      strength: { min: 6, max: 10 },
      defense: { min: 8, max: 10 },
      morale: { min: 6, max: 10 },
      agility: { min: 4, max: 10 },
    },
  },
  Rare: {
    Cowboy: {
      vitality: { min: 6, max: 20 },
      strength: { min: 10, max: 20 },
      defense: { min: 4, max: 20 },
      morale: { min: 6, max: 20 },
      agility: { min: 6, max: 20 },
    },
    Shinobi: {
      vitality: { min: 4, max: 20 },
      strength: { min: 10, max: 20 },
      defense: { min: 6, max: 20 },
      morale: { min: 10, max: 20 },
      agility: { min: 14, max: 20 },
    },
    Robot: {
      vitality: { min: 10, max: 20 },
      strength: { min: 10, max: 20 },
      defense: { min: 10, max: 20 },
      morale: { min: 6, max: 20 },
      agility: { min: 8, max: 20 },
    },
    Zombie: {
      vitality: { min: 16, max: 20 },
      strength: { min: 10, max: 20 },
      defense: { min: 12, max: 20 },
      morale: { min: 6, max: 20 },
      agility: { min: 2, max: 20 },
    },
    Knight: {
      vitality: { min: 14, max: 20 },
      strength: { min: 12, max: 20 },
      defense: { min: 16, max: 20 },
      morale: { min: 12, max: 20 },
      agility: { min: 8, max: 20 },
    },
  },
  Epic: {
    Cowboy: {
      vitality: { min: 20, max: 50 },
      strength: { min: 30, max: 50 },
      defense: { min: 15, max: 50 },
      morale: { min: 20, max: 50 },
      agility: { min: 20, max: 50 },
    },
    Shinobi: {
      vitality: { min: 15, max: 50 },
      strength: { min: 30, max: 50 },
      defense: { min: 20, max: 50 },
      morale: { min: 30, max: 50 },
      agility: { min: 14, max: 50 },
    },
    Robot: {
      vitality: { min: 30, max: 50 },
      strength: { min: 30, max: 50 },
      defense: { min: 30, max: 50 },
      morale: { min: 20, max: 50 },
      agility: { min: 15, max: 50 },
    },
    Zombie: {
      vitality: { min: 36, max: 50 },
      strength: { min: 30, max: 50 },
      defense: { min: 12, max: 50 },
      morale: { min: 20, max: 50 },
      agility: { min: 10, max: 50 },
    },
    Knight: {
      vitality: { min: 14, max: 50 },
      strength: { min: 12, max: 50 },
      defense: { min: 36, max: 50 },
      morale: { min: 12, max: 50 },
      agility: { min: 15, max: 50 },
    },
  },
  Legend: {
    Cowboy: {
      vitality: { min: 40, max: 100 },
      strength: { min: 60, max: 100 },
      defense: { min: 30, max: 100 },
      morale: { min: 40, max: 100 },
      agility: { min: 40, max: 100 },
    },
    Shinobi: {
      vitality: { min: 30, max: 100 },
      strength: { min: 60, max: 100 },
      defense: { min: 40, max: 100 },
      morale: { min: 60, max: 100 },
      agility: { min: 28, max: 100 },
    },
    Robot: {
      vitality: { min: 60, max: 100 },
      strength: { min: 60, max: 100 },
      defense: { min: 60, max: 100 },
      morale: { min: 40, max: 100 },
      agility: { min: 30, max: 100 },
    },
    Zombie: {
      vitality: { min: 80, max: 100 },
      strength: { min: 60, max: 100 },
      defense: { min: 12, max: 100 },
      morale: { min: 40, max: 100 },
      agility: { min: 10, max: 100 },
    },
    Knight: {
      vitality: { min: 28, max: 100 },
      strength: { min: 12, max: 100 },
      defense: { min: 80, max: 100 },
      morale: { min: 12, max: 100 },
      agility: { min: 30, max: 100 },
    },
  },
};
