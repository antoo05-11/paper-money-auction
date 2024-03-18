import { gql } from 'graphql-tag';
import { userType, userQueries, userMutations } from "./user/index.js";

export const typeDefs = gql`
  type Query
  type Mutation
  ${userType}
`;

export const resolvers = {
  Query: {
    ...userQueries,
  },
  Mutation: {
    ...userMutations,
  },
};
