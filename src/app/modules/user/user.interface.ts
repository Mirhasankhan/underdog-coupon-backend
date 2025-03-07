import { UserRole, UserStatus } from "@prisma/client";

export interface IUser {
  userName: string;
  email: string;
  password: string;
}

export interface IUpdateUser {
  userNa?: string;
  mobile?: string;
  avatar?: string;
  role?: UserRole;
  status?: UserStatus;
}
