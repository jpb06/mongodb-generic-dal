export const setEnv = (
  url: string,
  db: string,
  userName?: string,
  password?: string
) => {
  process.env.MONGODB_URL = url;
  process.env.MONGODB_DB = db;
  if (userName) {
    process.env.MONGODB_DB_USR = userName;
  }
  if (password) {
    process.env.MONGODB_DB_PWD = password;
  }
};
