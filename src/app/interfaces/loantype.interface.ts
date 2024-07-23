import { LoanTypes } from '../enums/loanTypes.enum';

export interface ILoanType {
  _id: string;
  name: LoanTypes | string | null;
  conditions: string | null;
  rate: number | null;
  term: number | null;
  createdAt: Date;
  updatedAt: Date;
}
