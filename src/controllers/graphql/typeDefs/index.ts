import { gql } from 'apollo-server-express';

// const filterTypeDefs = gql``;

const characterTypeDefs = gql`
  type CharacterStats {
    vitality: Int!
    strength: Int!
    defense: Int!
    morale: Int!
    agility: Int!
  }

  type Character {
    _id: ID!
    tokenId: Int!
    type: String!
    rarity: String!
    class: String!
    stats: CharacterStats!
  }

  type Query {
    characters(tokenIds: [Int] = []): [Character]
  }
`;

const typeDefs = gql`
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  # This "Book" type defines the queryable fields for every book in our data source.
  type Book {
    title: String
    author: String
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
    books: [Book]
  }
`;

// combine typedefs
const finalTypeDefs = [characterTypeDefs, typeDefs];

export default finalTypeDefs;
