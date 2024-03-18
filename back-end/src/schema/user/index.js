import path from 'path';
import { readFileSync } from 'fs';

const __dirname = path.dirname(new URL(import.meta.url).pathname);
export const userType = readFileSync(path.join(__dirname, './user.graphql'), { encoding: 'utf8'});

export { userQueries } from './queries.js';
export { userMutations } from './mutations.js';