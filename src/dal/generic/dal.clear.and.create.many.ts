import { OptionalId } from "mongodb";

import { dbConnect } from "../connection/db.connection";

export const clearAndCreateMany = async <T>(
  collectionName: string,
  term: object,
  values: Array<OptionalId<T>>
): Promise<boolean> => {
  const { client, database } = await dbConnect();

  try {
    const db = client.db(database);
    const collection = db.collection<T>(collectionName);

    const deleteResult = await collection.deleteMany(term);
    const insertResult = await collection.insertMany(values);

    const isSuccess =
      deleteResult.result.ok === 1 && insertResult.result.ok === 1;
    return isSuccess ? true : false;
  } catch (err) {
    throw { ...err, message: err.message };
  } finally {
    await client.close();
  }
};
