import { DbConfig, EnvDbConfig } from "../types/db.config.interface";

const verifyConfig = (config: EnvDbConfig) => {
  const urlRegex = /^(mongodb:(?:\/{2})?)((\w+?):(\w+?)@|:?@?)(\S+?):(\d+)(\/(\S+?))?(\?replicaSet=(\S+?))?$/;
  if (!config.url || !urlRegex.test(config.url)) {
    throw new Error("Invalid url specified to access mongodb instance");
  }

  if (!config.database || config.database.length === 0) {
    throw new Error("No database specified");
  }
};

export const getDbConfig = (): DbConfig => {
  const config = {
    url: process.env.MONGODB_URL,
    database: process.env.MONGODB_DB,
    username: process.env.MONGODB_DB_USR || "",
    password: process.env.MONGODB_DB_PWD || "",
  };
  verifyConfig(config);

  return config as DbConfig;
};
