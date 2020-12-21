import { MatchKeysAndValues, OptionalId } from "mongodb";

import { dbConnect } from "../connection/db.connection";

export const createOrUpdate = async <T>(
  collectionName: string,
  term: object,
  value: OptionalId<T>
): Promise<T | undefined> => {
  const { client, database } = await dbConnect();

  try {
    const db = client.db(database);
    const collection = db.collection<T>(collectionName);

    // nb : upsert either
    // + Creates a new document if no documents match the filter. Returns null after inserting the new document, unless returnNewDocument is true.
    // + Updates a single document that matches the filter.

    const result = await collection.findOneAndUpdate(
      term,
      { $set: value as MatchKeysAndValues<T> },
      { upsert: true, returnOriginal: false }
    );
    if (result.ok === 1) return result.value;

    return undefined;
  } catch (err) {
    throw { ...err, message: err.message };
  } finally {
    await client.close();
  }
};
