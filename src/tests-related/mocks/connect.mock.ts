import { MongoClient } from "mongodb";

import * as dbutil from "../../dal/connection/db.connection";

interface SpyOnConnectOptions {
  error?: any;
  insertOneResult?: any;
  findOneAndUpdateResult?: any;
  deleteResult?: any;
  insertResult?: any;
}

export const spyOnConnect = (options: SpyOnConnectOptions) =>
  jest.spyOn(dbutil, "dbConnect").mockReturnValueOnce(
    Promise.resolve({
      client: ({
        db: jest.fn(() => {
          if (options.error) {
            throw options.error;
          }
          return {
            collection: jest.fn(() => ({
              insertOne: jest.fn(() => options.insertOneResult),
              findOneAndUpdate: jest.fn(() => options.findOneAndUpdateResult),
              insertMany: jest.fn(() => options.insertResult),
              deleteMany: jest.fn(() => options.deleteResult),
            })),
          };
        }),
        close: jest.fn(),
      } as unknown) as MongoClient,
      database: "test",
    })
  );
