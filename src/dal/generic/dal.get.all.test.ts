import { MongoClient } from "mongodb";
import { MongoMemoryServer } from "mongodb-memory-server";

import { spyOnConnect } from "../../tests-related/mocks/connect.mock";
import { clear, insert } from "../../tests-related/peudo.dal";
import { SampleItem } from "../../tests-related/sample.item.interface";
import { setEnv } from "../../tests-related/set.env";
import { getAll } from "./dal.get.all";

describe("dal clearAndCreateMany generic function", () => {
  let mongoServer: MongoMemoryServer;
  let client: MongoClient;
  const collection = "getall";

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

  it("should return an empty array when collection is empty", async () => {
    const items = await getAll<SampleItem>(collection);

    expect(items).toHaveLength(0);
  });

  it("should return stored entries", async () => {
    await insert(client, collection, { name: "one" });
    await insert(client, collection, { name: "two" });
    await insert(client, collection, { name: "three" });

    const items = await getAll<SampleItem>(collection);

    expect(items).toHaveLength(3);
    expect(items[0].name).toEqual("one");
    expect(items[1].name).toEqual("two");
    expect(items[2].name).toEqual("three");
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

    expect(getAll<SampleItem>(collection)).rejects.toEqual(error);

    connectSpy.mockRestore();
  });
});
