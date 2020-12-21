import { OptionalId } from "mongodb";

import { clearAndCreateMany } from "./dal.clear.and.create.many";

export const clearAllAndCreateMany = async <T>(
  collectionName: string,
  values: Array<OptionalId<T>>
): Promise<boolean> => await clearAndCreateMany<T>(collectionName, {}, values);
