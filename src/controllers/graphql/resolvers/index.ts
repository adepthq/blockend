import Characters from '../../../services/characters';
import serializeWhereFilter from './argSerializer';

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
  },
};

export default resolvers;
