import { IClient } from './client.interface';
import { ILoanType } from './loantype.interface';

export interface ILoan {
  _id: string;
  loanType: ILoanType;
  client: IClient;
  amount: number;
  dateIssued: Date;
  dueDate: Date;
  dateRepaid?: Date;
  parts: number;
  fineAmount: number;
  createdAt: Date;
  updatedAt: Date;
}
