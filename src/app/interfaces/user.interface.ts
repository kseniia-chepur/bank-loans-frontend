export interface IUser {
  id: string;
  email: string | null;
  username: string | null;
  password: string | null;
  role: string | null;
  createdAt: Date;
  updatedAt: Date;
}
