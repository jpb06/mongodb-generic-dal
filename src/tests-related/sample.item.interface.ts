import { ObjectId } from "mongodb";

export interface SampleItem {
  _id?: ObjectId;
  name: string;
  value?: number;
}
