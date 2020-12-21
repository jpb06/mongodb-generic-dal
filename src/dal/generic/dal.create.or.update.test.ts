import { MongoClient } from "mongodb";
import { MongoMemoryServer } from "mongodb-memory-server";

import { spyOnConnect } from "../../tests-related/mocks/connect.mock";
import { clear, getAllFrom, insert } from "../../tests-related/peudo.dal";
import { SampleItem } from "../../tests-related/sample.item.interface";
import { setEnv } from "../../tests-related/set.env";
import { createOrUpdate } from "./dal.create.or.update";

describe("dal createOrUpdate generic function", () => {
  let mongoServer: MongoMemoryServer;
  let client: MongoClient;
  const collection = "createOrUpdate";

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

  it("should create a document if it does not exist", async () => {
    const name = "blah";
    const element = await createOrUpdate<SampleItem>(
      collection,
      { name: "yolo" },
      { name }
    );

    const data = await getAllFrom(client, collection);
    expect(data.length).toEqual(1);
    expect(data[0]._id).toEqual(element?._id);
    expect(data[0].name).toEqual(name);
  });

  it("should update an existing document", async () => {
    const name = "blah";
    await insert(client, collection, { name: "yolo" });

    const element = await createOrUpdate<SampleItem>(
      collection,
      { name: "yolo" },
      { name }
    );

    const data = await getAllFrom(client, collection);
    expect(data.length).toEqual(1);
    expect(data[0]._id).toEqual(element?._id);
    expect(data[0].name).toEqual(name);
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
      createOrUpdate<SampleItem>(collection, { name: "yolo" }, { name: "yola" })
    ).rejects.toEqual(error);

    connectSpy.mockRestore();
  });

  it("should return undefined", async () => {
    const connectSpy = spyOnConnect({ findOneAndUpdateResult: { ok: 2 } });

    const result = await createOrUpdate<SampleItem>(
      collection,
      { name: "yolo" },
      { name: "yola" }
    );
    expect(result).toBeUndefined();

    connectSpy.mockRestore();
  });
});
