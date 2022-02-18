import { Collection, MongoClient } from 'mongodb';
import { BigNumber } from 'ethers';
import {
  CharacterType,
  CharacterRarity,
  CharacterStats,
  CharacterClass,
  CharacterDocument,
  statsTree,
  CharacterStatsMinMax,
  NewBlockHeadCreated,
} from '../models/character';
import Logger from '../lib/logger';
import mongoclient from '../lib/mongoclient';

const getDBCollection = async (client: MongoClient): Promise<Collection<CharacterDocument>> => {
  const db = client.db('blockheads');
  const collection = db.collection<CharacterDocument>('characters');

  return collection;
};

const randomRange = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const getCharacterType = (): CharacterType[keyof CharacterType] => {
  const enumValues = Object.keys(CharacterType).map(key => key);
  const randomIndex = Math.floor(Math.random() * enumValues.length);

  return enumValues[randomIndex];
};

const getCharacterRarity = (): CharacterRarity[keyof CharacterType] => {
  const enumValues = Object.keys(CharacterRarity).map(key => key);
  const rarity = Math.floor(Math.random() * 100);
  let randomIndex = 0;

  // common: 65%
  // rare: 20%
  // epic: 10%
  // legend: 5%
  if (rarity <= 65) {
    randomIndex = 0;
  } else if (rarity > 65 && rarity <= 85) {
    randomIndex = 1;
  } else if (rarity > 85 && rarity <= 95) {
    randomIndex = 2;
  } else if (rarity > 95 && rarity <= 100) {
    randomIndex = 3;
  } else {
    randomIndex = 0;
  }

  return enumValues[randomIndex];
};

const getCharacterClass = (): CharacterClass[keyof CharacterType] => {
  const enumValues = Object.keys(CharacterClass).map(key => key);
  const randomIndex = Math.floor(Math.random() * enumValues.length);

  return enumValues[randomIndex];
};

const getCharacterStats = async (
  characterRarity: CharacterRarity[keyof CharacterRarity],
  characterClass: CharacterClass[keyof CharacterClass]
): Promise<CharacterStats> => {
  Logger.info(`Generating Character Stats for ${characterRarity} ${characterClass}`);

  // eslint-disable-next-line dot-notation
  const statsData: CharacterStatsMinMax = statsTree[characterRarity.toString()][characterClass.toString()];

  return {
    vitality: randomRange(statsData.vitality.min, statsData.vitality.max),
    strength: randomRange(statsData.strength.min, statsData.strength.max),
    defense: randomRange(statsData.defense.min, statsData.defense.max),
    morale: randomRange(statsData.morale.min, statsData.morale.max),
    agility: randomRange(statsData.agility.min, statsData.agility.max),
  };
};

const generateCharacterMetaData = async (event: NewBlockHeadCreated): Promise<CharacterDocument> => {
  const type = getCharacterType();
  const rarity = getCharacterRarity();
  const classType = getCharacterClass();

  const stats: CharacterStats = await getCharacterStats(rarity, classType);

  Logger.info(`Generating Character for tokenId: ${event.tokenId} - ${type}`);

  const character: CharacterDocument = {
    tokenId: event.tokenId.toNumber(),
    owner: event.owner,
    type,
    rarity,
    class: classType,
    stats,
  };

  return {
    ...character,
  };
};

const saveCharacters = async (client: MongoClient, characters: CharacterDocument[]): Promise<CharacterDocument[]> => {
  const collection = await getDBCollection(client);
  const newCharacters = await collection.insertMany(characters);

  Logger.info(`New Characters Created: `);
  Logger.info(newCharacters.insertedIds);

  return characters;
};

const getCharacter = async (client: MongoClient, tokenId: BigNumber): Promise<CharacterDocument | null> => {
  const collection = await getDBCollection(client);
  const character = await collection.findOne({ tokenId: tokenId.toNumber() });

  return character;
};

type CharacterFilter = {
  limit: number;
  offset: number;
  where: any;
  orderBy: any;
};

const getAllCharacters = async (filters: CharacterFilter): Promise<CharacterDocument[]> => {
  let characters: CharacterDocument[] = [];

  try {
    const client = await mongoclient.connect();
    const collection = await getDBCollection(client);

    const query = filters.where;
    // check if there is a stats filter
    if (query.stats) {
      const statsFilter = query.stats;
      delete query.stats;

      Object.keys(statsFilter).forEach(key => {
        query[`stats.${key}`] = statsFilter[key];
      });
    }

    console.log('query', query);

    let cursor = await collection.find(query);

    if (filters.limit) {
      cursor = cursor.limit(filters.limit);
    }

    if (filters.offset) {
      cursor = cursor.skip(filters.offset);
    }

    characters = await cursor.toArray();
  } catch (error) {
    Logger.error(error);
  } finally {
    mongoclient.disconnect();
  }

  return characters;
};

export default {
  generateCharacterMetaData,
  getCharacter,
  getAllCharacters,
  saveCharacters,
};
