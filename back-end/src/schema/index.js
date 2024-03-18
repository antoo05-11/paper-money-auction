// import { fileURLToPath } from 'url';
// import { join, dirname } from 'path';
// import { readdirSync, readFileSync } from 'fs';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// const gqlFiles = readdirSync(join(__dirname, './typedefs'));

// let content = '';

// gqlFiles.forEach((file) => {
//   content += readFileSync(join(__dirname, './typedefs', file), {
//     encoding: 'utf8',
//   });
// });

// const typeDefs = content;

// export default typeDefs;

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
