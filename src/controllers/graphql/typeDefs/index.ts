import { gql } from 'apollo-server-express';
import inputComparisonTypeDefs from './baseTypeComparison';

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
    owner: String!
    tokenId: Int!
    type: String!
    rarity: String!
    class: String!
    stats: CharacterStats!
  }

  input CharacterStats_bool_exp {
    vitality: Int_comparison_exp
    strength: Int_comparison_exp
    defense: Int_comparison_exp
    morale: Int_comparison_exp
    agility: Int_comparison_exp
  }

  input Character_bool_exp {
    _and: [Character_bool_exp!]
    _or: [Character_bool_exp!]
    _not: Character_bool_exp
    tokenId: Int_comparison_exp
    type: String_comparison_exp
    rarity: String_comparison_exp
    class: String_comparison_exp
    stats: CharacterStats_bool_exp
    owner: String_comparison_exp
  }

  input Character_order_by {
    _id: order_by
    tokenId: order_by
    type: order_by
    rarity: order_by
    class: order_by
  }

  type Query {
    characters(limit: Int, offset: Int, orderBy: [Character_order_by], where: [Character_bool_exp]): [Character]
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
const finalTypeDefs = [inputComparisonTypeDefs, characterTypeDefs, typeDefs];

export default finalTypeDefs;
