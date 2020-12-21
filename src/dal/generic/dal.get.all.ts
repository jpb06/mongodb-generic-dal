import { dbConnect } from "../connection/db.connection";

export const getAll = async <T>(collectionName: string): Promise<Array<T>> => {
  const { client, database } = await dbConnect();

  try {
    const db = client.db(database);
    const collection = db.collection<T>(collectionName);

    const result = await collection.find().toArray();

    return result;
  } catch (err) {
    throw { ...err, message: err.message };
  } finally {
    await client.close();
  }
};
