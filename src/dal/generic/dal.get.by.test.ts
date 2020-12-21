import { MongoClient } from "mongodb";
import { MongoMemoryServer } from "mongodb-memory-server";

import { spyOnConnect } from "../../tests-related/mocks/connect.mock";
import { clear, insert } from "../../tests-related/peudo.dal";
import { SampleItem } from "../../tests-related/sample.item.interface";
import { setEnv } from "../../tests-related/set.env";
import { getBy } from "./dal.get.by";

describe("dal clearAndCreateMany generic function", () => {
  let mongoServer: MongoMemoryServer;
  let client: MongoClient;
  const collection = "getby";

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
    const items = await getBy<SampleItem>(collection, {}, {});

    expect(items).toHaveLength(0);
  });

  it("should return an empty array when there is no match in the collection", async () => {
    await insert(client, collection, { name: "one", value: 1 });
    await insert(client, collection, { name: "two", value: 2 });
    await insert(client, collection, { name: "three", value: 3 });

    const items = await getBy<SampleItem>(collection, { value: 4 }, {});

    expect(items).toHaveLength(0);
  });

  it("should return all stored entries", async () => {
    await insert(client, collection, { name: "one", value: 1 });
    await insert(client, collection, { name: "two", value: 2 });
    await insert(client, collection, { name: "three", value: 3 });

    const items = await getBy<SampleItem>(collection, {}, {});

    expect(items).toHaveLength(3);
    expect(items[0].name).toEqual("one");
    expect(items[1].name).toEqual("two");
    expect(items[2].name).toEqual("three");
  });

  it("should return entries matching criteria", async () => {
    await insert(client, collection, { name: "one", value: 1 });
    await insert(client, collection, { name: "two", value: 2 });
    await insert(client, collection, { name: "two second", value: 2 });

    const items = await getBy<SampleItem>(collection, { value: 2 }, {});

    expect(items).toHaveLength(2);
    expect(items[0].name).toEqual("two");
    expect(items[1].name).toEqual("two second");
  });

  it("should apply ascending order to matching entries", async () => {
    await insert(client, collection, { name: "ten", value: 10 });
    await insert(client, collection, { name: "two", value: 2 });
    await insert(client, collection, { name: "one", value: 1 });
    await insert(client, collection, { name: "twenty three", value: 23 });
    await insert(client, collection, { name: "three", value: 3 });
    await insert(client, collection, { name: "seven", value: 7 });

    const items = await getBy<SampleItem>(collection, {}, { value: 1 });

    expect(items).toHaveLength(6);
    expect(items[0].name).toEqual("one");
    expect(items[1].name).toEqual("two");
    expect(items[2].name).toEqual("three");
    expect(items[3].name).toEqual("seven");
    expect(items[4].name).toEqual("ten");
    expect(items[5].name).toEqual("twenty three");
  });

  it("should apply descending order to matching entries", async () => {
    await insert(client, collection, { name: "ten", value: 10 });
    await insert(client, collection, { name: "two", value: 2 });
    await insert(client, collection, { name: "one", value: 1 });
    await insert(client, collection, { name: "twenty three", value: 23 });
    await insert(client, collection, { name: "three", value: 3 });
    await insert(client, collection, { name: "seven", value: 7 });

    const items = await getBy<SampleItem>(collection, {}, { value: -1 });

    expect(items).toHaveLength(6);
    expect(items[0].name).toEqual("twenty three");
    expect(items[1].name).toEqual("ten");
    expect(items[2].name).toEqual("seven");
    expect(items[3].name).toEqual("three");
    expect(items[4].name).toEqual("two");
    expect(items[5].name).toEqual("one");
  });

  it("should limit results", async () => {
    await insert(client, collection, { name: "ten", value: 10 });
    await insert(client, collection, { name: "two", value: 2 });
    await insert(client, collection, { name: "one", value: 1 });
    await insert(client, collection, { name: "twenty three", value: 23 });
    await insert(client, collection, { name: "three", value: 3 });
    await insert(client, collection, { name: "seven", value: 7 });

    const items = await getBy<SampleItem>(collection, {}, {}, 3);

    expect(items).toHaveLength(3);
    expect(items[0].name).toEqual("ten");
    expect(items[1].name).toEqual("two");
    expect(items[2].name).toEqual("one");
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

    expect(getBy<SampleItem>(collection, {}, {})).rejects.toEqual(error);

    connectSpy.mockRestore();
  });
});
