import { MongoClient } from "mongodb";
import { MongoMemoryServer } from "mongodb-memory-server";

import { spyOnConnect } from "../../tests-related/mocks/connect.mock";
import { clear, getAllFrom, insert } from "../../tests-related/peudo.dal";
import { SampleItem } from "../../tests-related/sample.item.interface";
import { setEnv } from "../../tests-related/set.env";
import { clearAllAndCreateMany } from "./dal.clear.all.and.create.many";

describe("dal clearAllAndCreateMany generic function", () => {
  let mongoServer: MongoMemoryServer;
  let client: MongoClient;
  const collection = "clearAllAndCreateMany";

  beforeAll(async () => {
    mongoServer = new MongoMemoryServer();
    const mongoUri = await mongoServer.getUri();
    setEnv(mongoUri, "myday");
    client = await MongoClient.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    await client.close();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    await clear(client, collection);
  });

  it("should remove matching entries and add a new one", async () => {
    const name = "blah";

    await insert(client, collection, { name: "yolo" });
    await insert(client, collection, { name: "yolo" });
    await insert(client, collection, {
      name: "this one does not stays either",
    });

    const isInserted = await clearAllAndCreateMany<SampleItem>(collection, [
      { name },
    ]);

    const data = await getAllFrom(client, collection);

    expect(isInserted).toBe(true);
    expect(data.length).toEqual(1);
    expect(data[0].name).toEqual(name);
  });

  it("should remove matching entries and insert several new ones", async () => {
    await insert(client, collection, { name: "yolo" });
    await insert(client, collection, { name: "yolo" });
    await insert(client, collection, {
      name: "this one does not stays either",
    });

    const isInserted = await clearAllAndCreateMany<SampleItem>(collection, [
      { name: "cool" },
      { name: "brah" },
    ]);

    const data = await getAllFrom(client, collection);

    expect(isInserted).toBe(true);
    expect(data.length).toEqual(2);
    expect(data[0].name).toEqual("cool");
    expect(data[1].name).toEqual("brah");
  });

  it("should throw an error", async () => {
    const error = {
      ok: 0,
      code: 13,
      codeName: "Unauthorized",
      name: "MongoError",
      message: "command insert requires authentication",
    };
    const connectSpy = spyOnConnect({ error });

    expect(
      clearAllAndCreateMany(collection, [{ name: "yolo" }])
    ).rejects.toEqual(error);

    connectSpy.mockRestore();
  });

  it("should throw return false when task failed", async () => {
    const error = {
      ok: 0,
      code: 13,
      codeName: "Unauthorized",
      name: "MongoError",
      message: "command insert requires authentication",
    };
    const connectSpy = spyOnConnect({
      insertResult: { result: { ok: 0 } },
      deleteResult: { result: { ok: 1 } },
    });

    const result = await clearAllAndCreateMany(collection, [{ name: "yolo" }]);
    expect(result).toBe(false);

    connectSpy.mockRestore();
  });
});
