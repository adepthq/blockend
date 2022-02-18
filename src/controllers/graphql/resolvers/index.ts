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

const characterResolvers = {
  Query: {
    characters: (parent: any, args: any) => {
      console.log('parent', parent);
      console.log('args', args);

      return Characters.getAllCharacters(args.tokenIds);
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
