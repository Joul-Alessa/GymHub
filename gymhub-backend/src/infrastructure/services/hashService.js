import bcrypt from "bcrypt";

export const hashService = {
  hash: async (password) => {
    const saltRounds = 10; // Cambiar a .env
    return await bcrypt.hash(password, saltRounds);
  },
  compare: async (password, hash) => {
    return await bcrypt.compare(password, hash);
  }
};