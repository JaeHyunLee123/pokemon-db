import { User } from "@/generated/prisma";

export type UserResponse = Omit<User, "password">;
