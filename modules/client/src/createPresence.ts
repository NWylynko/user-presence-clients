import { createAutoPresence } from "./createAutoPresence";
import type { AutoOptions, User as AutoUser } from "./createAutoPresence";
import { createManualPresence } from "./createManualPresence";
import type { ManualOptions, User as ManualUser, DefaultManualStatus, UserOptions } from "./createManualPresence";
import { createWebsocket } from "./websocket";

export type Options = AutoOptions | ManualOptions

export function createPresence<Status = DefaultManualStatus>(options: ManualOptions<Status>): (config: UserOptions) => ManualUser<Status>;
export function createPresence(options: AutoOptions): (config: UserOptions) => AutoUser;
export function createPresence(options: Options) {

  // this doesn't open the connection thou
  const connection = createWebsocket();

  if (options.mode === "auto") {

    return createAutoPresence(options, connection);

  } else if (options.mode === "manual") {

    return createManualPresence(options, connection);

  } else {

    throw new Error(`The mode ${(options as any).mode} is not supported, choice either auto or manual`);

  }

}
