import { MongoClient } from "mongodb";

export const getAllFrom = async (
  client: MongoClient,
  collectionName: string
) => {
  let db = client.db(process.env.MONGODB_DB);
  const collection = db.collection(collectionName);
  const data = await collection.find({}).toArray();

  return data;
};

export const insert = async (
  client: MongoClient,
  collectionName: string,
  item: any
) => {
  let db = client.db(process.env.MONGODB_DB);
  const collection = db.collection(collectionName);
  await collection.insertOne(item);
};

export const clear = async (client: MongoClient, collectionName: string) => {
  let db = client.db(process.env.MONGODB_DB);
  const collection = db.collection(collectionName);
  await collection.deleteMany({});
};
