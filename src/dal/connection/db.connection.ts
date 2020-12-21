import { MongoClient, MongoClientOptions } from "mongodb";

import { getDbConfig } from "../config/db.config";

interface ConnectionResult {
  client: MongoClient;
  database: string;
}

export const dbConnect = async (): Promise<ConnectionResult> => {
  const { url, username, password, database } = getDbConfig();

  const options: MongoClientOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };
  if (username.length > 0 && password.length > 0) {
    options.auth = {
      user: username,
      password: password,
    };
  }
  const client = await MongoClient.connect(url, options);

  return { client, database };
};
