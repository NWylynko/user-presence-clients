import { authHeader } from "./authHeader";
import { axios } from "./axios";
import type { APIResponse } from "./axios";
import type { Options } from "./client";

export type User<Status> = {
  userId: string;
  status: Status;
  online: boolean;
  lastPing: number;
}

export const getUser = <Status>(opts: Options) => async (userId: string) => {

  const headers = authHeader(opts)

  const response = await axios.get<APIResponse<User<Status>>>(`/user/${userId}`, { headers })

  const { data } = response.data;

  return {
    ...data,
    lastPing: new Date(data.lastPing)
  };

}