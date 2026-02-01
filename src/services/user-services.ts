import { NoSessionError, NoUserError } from "@/errors/auth-error";
import { getSession } from "@/libs/session";
import { userRepository } from "@/repositories/user-repository";

export const userService = {
  async findUserBySession() {
    const payload = await getSession();

    if (!payload) {
      throw new NoSessionError();
    }

    const user = await userRepository.findUserById(payload.userId);

    if (!user) {
      throw new NoUserError();
    }

    return user;
  },
};
