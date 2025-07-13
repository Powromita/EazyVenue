import { IResolvers } from '@graphql-tools/utils';

export const typeDefs = `
  type Query {
    hello: String
  }
`;

export const resolvers: IResolvers = {
  Query: {
    hello: () => 'Hello world!',
  },
}; 