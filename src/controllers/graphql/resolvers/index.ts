import Characters from '../../../services/characters';

const books = [
  {
    title: 'The Awakening',
    author: 'Kate Chopin',
  },
  {
    title: 'City of Glass',
    author: 'Paul Auster',
  },
];

// const getCondition = (symbol: string): string => {
//   // check if string starts with _
//   if (symbol.startsWith('_')) {
//     // replace _ with $
//     symbol = symbol.replace('_', '$');
//     return symbol;
//   }

//   return symbol;
// }

const serializeWhereFilter = (where: any) => {
  // const json = [{ tokenId: { _in: [1, 100] }, rarity: { _eq: 'Knight' } }];
  let jsonStr = JSON.stringify(where);
  jsonStr = jsonStr.replace(/_/g, '$');

  // convert to readable json
  const serializedWhere = JSON.parse(jsonStr);

  return serializedWhere;
};

const characterResolvers = {
  Query: {
    characters: (parent: any, args: any) => {
      console.log('parent', parent);
      console.log('args');

      const { limit, offset, orderBy, where } = args;
      const serializedFilter = serializeWhereFilter(where);

      console.log('jsonFilter');
      console.log(serializedFilter[0]);

      return Characters.getAllCharacters({ limit, offset, orderBy, where: serializedFilter[0] });
    },
  },
};

// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
const resolvers = {
  Query: {
    ...characterResolvers.Query,
    books: () => books,
  },
};

// Combine Resolvers
const finalResolvers = { ...resolvers };

export default finalResolvers;
