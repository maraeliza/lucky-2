import { UserType } from "generated/prisma";

export class User {
  id: number = 0;
  name: string = '';
  email: string = '';
  addressId: number = 0;
  phone: string = '';
  password: string = '';
  role: UserType = "CLIENT";
  createdAt: Date = new Date();
  updatedAt: Date = new Date();
}
