import User from "./user.js";

export const userMutations = {
  createUser: async (_, args) => {
    const { user } = args;
    const newUser = await User.create(user);

    newUser.id = newUser._id.toString();
    return newUser;
  },
  updateUser: async (_, args) => { },
};