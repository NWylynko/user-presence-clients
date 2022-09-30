import type { Options } from "./client";


export const authHeader = (opts: Options) => {
  return {
    "authorization": `Bearer ${opts.api_key}`
  }
}