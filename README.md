# mongodb-generic-dal

![Statements](./badges/badge-statements.svg) ![Branches](./badges/badge-branches.svg) ![Functions](./badges/badge-functions.svg) ![Lines](./badges/badge-lines.svg)

## purpose

This is a little library built on top mongodb native nodejs driver.

The package exposes its own declaration files; you won't need to install any @types/\* if you use typescript.

## Installation

To install, use either yarn or npm:

```bash
yarn add mongodb-generic-dal
```

```bash
npm i mongodb-generic-dal
```

## Prerequisites

The module relies on env variables to connect to a mongodb instance:

- MONGODB_URL : any valid mongodb url - https://docs.mongodb.com/manual/reference/connection-string/
- MONGODB_DB : the database to connect to
- MONGODB_DB_USR : username (if authentication is required)
- MONGODB_DB_PWD : password (if authentication is required)

## Let's look at a code example

```Typescript
import * as GenericDal from "mongodb-generic-dal";

interface MyData {
   _id?: ObjectId;
   name: string;
   value: number;
}

const letsCRUD = async () => {
   const item = {
      name: "Cool",
      value: 1024
   };
   const id = await GenericDal.create<MyData>("mycollection", item);
   const persistedItem = await GenericDal.getBy<MyData>("mycollection", { _id: id }, {});
   const updatedItem = await GenericDal.createOrUpdate<MyData>("mycollection", { _id: id }, {
      name: "Yolo",
      value: 0
   });
   const isDeleted = await GenericDal.remove("mycollection", {_id: id});
};
```

## API

### create

Inserts a document in the specified collection. Returns the id of the document inserted.

```Typescript
const create = async <T>(
   collectionName: string,
   value: OptionalId<T>
): Promise<ObjectId | undefined>
```

### createOrUpdate

Either creates a new document or updates an existing one, depending on the presence of **term** in the collection.

```Typescript
const createOrUpdate = async <T>(
  collectionName: string,
  term: object,
  value: OptionalId<T>
): Promise<T | undefined>
```

### getAll

Fetches all the documents in a collection.

```Typescript
const getAll = async <T>(
   collectionName: string
): Promise<Array<T>>
```

### getBy

Fetches documents in collection matching **term**. Items can be sorted using **sort**; a limited number of documents can be returned by specifying **count**.

```Typescript
const getBy = async <T>(
  collectionName: string,
  term: object,
  sort: object,
  count?: number
): Promise<Array<T>>
```

### clearAndCreateMany

Removes all documents matching **term** in collection, then inserts **values** in the collection.

```Typescript
const clearAndCreateMany = async <T>(
  collectionName: string,
  term: object,
  values: Array<OptionalId<T>>
): Promise<boolean>
```

### clearAllAndCreateMany

Removes all documents in collection, then inserts **values** in the collection.

```Typescript
const clearAllAndCreateMany = async <T>(
  collectionName: string,
  values: Array<OptionalId<T>>
): Promise<boolean>
```

### remove

Removes the document matching **term** from the collection.

```Typescript
const remove = async <T>(
  collectionName: string,
  term: object
): Promise<boolean>
```
