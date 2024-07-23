import { LoanTypes } from "../enums/loanTypes.enum";

export interface ILoanyType {
  _id: string;
  name: LoanTypes;
  conditions: string;
  rate: number;
  term: number;
  createdAt: Date;
  updatedAt: Date;
}
