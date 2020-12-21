import { MongoClient } from "mongodb";
import { MongoMemoryServer } from "mongodb-memory-server";

import { spyOnConnect } from "../../tests-related/mocks/connect.mock";
import { clear, getAllFrom, insert } from "../../tests-related/peudo.dal";
import { SampleItem } from "../../tests-related/sample.item.interface";
import { setEnv } from "../../tests-related/set.env";
import { remove } from "./dal.remove";

describe("dal remove generic function", () => {
  let mongoServer: MongoMemoryServer;
  let client: MongoClient;
  const collection = "remove";

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

  it("should return false when no entry has been removed", async () => {
    const hasSucceeded = await remove<SampleItem>(collection, {});

    expect(hasSucceeded).toBe(false);
  });

  it("should return false when no entry has been removed (no match)", async () => {
    await insert(client, collection, { name: "one", value: 1 });
    await insert(client, collection, { name: "two", value: 2 });
    await insert(client, collection, { name: "three", value: 3 });

    const hasSucceeded = await remove<SampleItem>(collection, { value: 4 });

    expect(hasSucceeded).toBe(false);
  });

  it("should return true when an entry has been removed", async () => {
    await insert(client, collection, { name: "one", value: 1 });
    await insert(client, collection, { name: "two", value: 2 });
    await insert(client, collection, { name: "three", value: 3 });

    const hasSucceeded = await remove<SampleItem>(collection, { value: 2 });

    const data = await getAllFrom(client, collection);
    expect(hasSucceeded).toBe(true);
    expect(data).toHaveLength(2);
    expect(data[0].name).toEqual("one");
    expect(data[1].name).toEqual("three");
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

    expect(remove<SampleItem>(collection, {})).rejects.toEqual(error);

    connectSpy.mockRestore();
  });
});
