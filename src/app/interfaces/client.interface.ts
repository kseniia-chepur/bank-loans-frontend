import { Ownership } from "../enums/ownership.enum";

export interface IClient {
  _id: string;
  name: string | null;
  ownership: Ownership | string | null;
  address: string | null;
  phone: string | null;
  contactPerson: string | null;
  createdAt: Date;
  updatedAt: Date;
}
