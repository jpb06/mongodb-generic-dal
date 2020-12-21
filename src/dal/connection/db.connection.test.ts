import { mocked } from "ts-jest/utils";

import { getDbConfig } from "../config/db.config";
import { dbConnect } from "./db.connection";

jest.mock("mongodb");
jest.mock("../config/db.config");

describe("db connect", () => {
  it("should create a connection without credentials", async () => {
    mocked(getDbConfig).mockReturnValueOnce({
      url: "mongodb://localhost:1000",
      database: "mydb",
      username: "",
      password: "",
    });

    const result = await dbConnect();

    expect(result.database).not.toHaveLength(0);
  });

  it("should create a connection without credentials if no username", async () => {
    mocked(getDbConfig).mockReturnValueOnce({
      url: "mongodb://localhost:1000",
      database: "mydb",
      username: "",
      password: "yolo",
    });

    const result = await dbConnect();

    expect(result.database).not.toHaveLength(0);
  });

  it("should create a connection without credentials if no password", async () => {
    mocked(getDbConfig).mockReturnValueOnce({
      url: "mongodb://localhost:1000",
      database: "mydb",
      username: "yolo",
      password: "",
    });

    const result = await dbConnect();

    expect(result.database).not.toHaveLength(0);
  });

  it("should create a connection with credentials", async () => {
    mocked(getDbConfig).mockReturnValueOnce({
      url: "mongodb://localhost:1000",
      database: "mydb",
      username: "Yolo",
      password: "Bro",
    });

    const result = await dbConnect();

    expect(result.database).not.toHaveLength(0);
  });
});
