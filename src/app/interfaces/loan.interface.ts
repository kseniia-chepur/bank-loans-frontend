import { IClient } from './client.interface';
import { ILoanType } from './loantype.interface';

export interface ILoan {
  _id: string;
  loanType: ILoanType | null;
  client: IClient | null;
  amount: number;
  dateIssued: Date;
  dueDate: Date;
  dateRepaid?: Date;
  parts: number;
  fineAmount: number;
  createdAt: Date;
  updatedAt: Date;
}
