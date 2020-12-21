import { MongoClient } from "mongodb";
import { MongoMemoryServer } from "mongodb-memory-server";

import { spyOnConnect } from "../../tests-related/mocks/connect.mock";
import { getAllFrom } from "../../tests-related/peudo.dal";
import { setEnv } from "../../tests-related/set.env";
import { create } from "./dal.create";

// May require additional time for downloading MongoDB binaries
// jasmine.DEFAULT_TIMEOUT_INTERVAL = 600000;

describe("dal create generic function", () => {
  let mongoServer: MongoMemoryServer;
  let client: MongoClient;
  const collection = "create";

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

  it("should create a document", async () => {
    const name = "blah";
    const id = await create(collection, { name });

    const data = await getAllFrom(client, collection);
    expect(data.length).toEqual(1);
    expect(data[0]._id).toEqual(id);
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

    expect(create(collection, { name: "blah" })).rejects.toEqual(error);

    connectSpy.mockRestore();
  });

  it("should return undefined", async () => {
    const connectSpy = spyOnConnect({ insertOneResult: { insertedCount: 2 } });

    const result = await create(collection, { name: "blah" });
    expect(result).toBeUndefined();

    connectSpy.mockRestore();
  });
});

// describe("dal generic store", () => {
//   it("should", async () => {
//     setEnv("mongodb://localhost:27017", "nope");
//     const collection = "creation";
//     const name = "blah";
//     try {
//       const id = await GenericStore.create(collection, { name });
//       console.log("id", id);
//     } catch (err) {
//       console.log(err);
//     }
//   });
// });
