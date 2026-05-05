import bcrypt from "bcrypt";

const SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS) ;

export const hashPassword = (password) => {
  return bcrypt.hash(password, SALT_ROUNDS);
};