import { getUser } from "./getUser";
import { getUsers } from "./getUsers";

export interface Options {
  api_key: string;
}

type DefaultStatus = "OFFLINE" | "ONLINE" | "AWAY"

export const client = <Status = DefaultStatus>(options: Options) => {
  return {
    getUser: getUser<Status>(options),
    getUsers: getUsers<Status>(options),
  };
};
