import { IClient } from "./client.interface";
import { ILoanType } from "./loantype.interface";

export interface ILoan {
  _id: string;
  loanType: ILoanType['_id'];
  client: IClient['_id'];
  amount: number;
  dateIssued: Date;
  dueDate: Date;
  dateRepaid?: string;
  parts: number;
  fineAmount: number;
  createdAt: Date;
  updatedAt: Date;
}
