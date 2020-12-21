import { dbConnect } from "../connection/db.connection";

export const getBy = async <T>(
  collectionName: string,
  term: object,
  sort: object,
  count?: number
): Promise<Array<T>> => {
  const { client, database } = await dbConnect();

  try {
    const db = client.db(database);
    const collection = db.collection<T>(collectionName);

    let result = collection.find(term).sort(sort);

    if (count) result = result.limit(count);

    return await result.toArray();
  } catch (err) {
    throw { ...err, message: err.message };
  } finally {
    await client.close();
  }
};
