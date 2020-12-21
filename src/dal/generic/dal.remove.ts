import { dbConnect } from "../connection/db.connection";

export const remove = async <T>(
  collectionName: string,
  term: object
): Promise<boolean> => {
  const { client, database } = await dbConnect();

  try {
    const db = client.db(database);
    const collection = db.collection<T>(collectionName);

    const result = await collection.deleteOne(term);

    return result.deletedCount === 1;
  } catch (err) {
    throw { ...err, message: err.message };
  } finally {
    await client.close();
  }
};
