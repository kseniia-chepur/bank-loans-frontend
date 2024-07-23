import { IClient } from "./client.interface";
import { ILoanyType } from "./loantype.interface";

export interface ILoan {
  _id: string;
  loanType: ILoanyType['_id'];
  client: IClient['_id'];
  amount: number;
  dateIssued: Date;
  dueDate: Date;
  dateRepaid?: Date;
  parts: number;
  fineAmount: number;
  createdAt: Date;
  updatedAt: Date;
}
