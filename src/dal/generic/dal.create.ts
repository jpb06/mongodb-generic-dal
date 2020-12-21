import { ObjectId } from "bson";
import { OptionalId } from "mongodb";

import { dbConnect } from "../connection/db.connection";

export const create = async <T>(
  collectionName: string,
  value: OptionalId<T>
): Promise<ObjectId | undefined> => {
  const { client, database } = await dbConnect();

  try {
    const db = client.db(database);
    const collection = db.collection<T>(collectionName);

    const result = await collection.insertOne(value);
    if (result.insertedCount === 1) return result.insertedId as ObjectId;

    return undefined;
  } catch (err) {
    throw { ...err, message: err.message };
  } finally {
    await client.close();
  }
};
