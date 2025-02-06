export interface IUser {
  _id: string;
  email: string;
  phone: number;
  name: string;
  role?: string;
  isAdmin?: boolean;
}
