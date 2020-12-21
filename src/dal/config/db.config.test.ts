import { setEnv } from "../../tests-related/set.env";
import { getDbConfig } from "./db.config";

describe("db config", () => {
  it("should work with a localhost url", () => {
    const url = "mongodb://localhost:27017";
    const db = "Yolo";
    setEnv(url, db);

    const config = getDbConfig();
    expect(config.url).toEqual(url);
    expect(config.database).toEqual(db);
  });

  it("should work with a local loop url", () => {
    const url = "mongodb://127.0.0.1:27017";
    const db = "Yolo";
    setEnv(url, db);

    const config = getDbConfig();
    expect(config.url).toEqual(url);
    expect(config.database).toEqual(db);
  });

  it("should return a config without credentials", () => {
    setEnv("mongodb://localhost:27017", "Yolo");

    const config = getDbConfig();
    expect(config.username).toBe("");
    expect(config.password).toBe("");
  });

  it("should return a config with credentials", () => {
    const username = "username";
    const password = "password";
    setEnv("mongodb://localhost:27017", "Yolo", username, password);

    const config = getDbConfig();
    expect(config.username).toEqual(username);
    expect(config.password).toEqual(password);
  });

  it("should throw an error if there is no database specified", () => {
    setEnv("mongodb://localhost:27017", "");

    expect(getDbConfig).toThrowError("No database specified");
  });

  it("should throw an error if there is no url specified", () => {
    setEnv("", "yolo");

    expect(getDbConfig).toThrowError(
      "Invalid url specified to access mongodb instance"
    );
  });

  it("should throw an error if the url is invalid", () => {
    setEnv("mongoyolo://yolo:1000", "yolo");

    expect(getDbConfig).toThrowError(
      "Invalid url specified to access mongodb instance"
    );
  });

  it("should validate mongodb memory server urls", () => {
    const url =
      "mongodb://127.0.0.1:8130/7f7fd8a6-3638-4235-8c7f-c91ff75a0be8?";
    const db = "Yolo";
    setEnv(url, db);

    const config = getDbConfig();
    expect(config.url).toEqual(url);
    expect(config.database).toEqual(db);
  });
});
