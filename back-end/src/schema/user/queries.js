import User from './db.js';

export const userQueries = {
  users: async (_, args) => {

  },
  user: async (_, arg) => {
    const { id } = arg;
    const user = await User.findById(id);

    return user;
  },
};
