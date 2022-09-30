import { authHeader } from "./authHeader";
import type { APIResponse } from "./axios";
import { axios } from "./axios";
import type { Options } from "./client";
import type { User } from "./getUser";

export type Users<Status> = Array<User<Status>>

export const getUsers = <Status>(opts: Options) => async () => {

  const headers = authHeader(opts)

  const response = await axios.get<APIResponse<Users<Status>>>(`/users`, { headers })

  const { data } = response.data;

  return data;

}
