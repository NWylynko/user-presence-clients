import { createAutoPresence } from "./createAutoPresence";
import type { AutoOptions, User as AutoUser, AutoOnStatusChange } from "./createAutoPresence";
import { createManualPresence } from "./createManualPresence";
import type { ManualOptions, User as ManualUser, DefaultManualStatus, UserOptions, ManualOnStatusChange } from "./createManualPresence";
import { createWebsocket } from "./websocket";
import type { ConnectionFunctions } from "./websocket";

export type Options = AutoOptions | ManualOptions

export function createPresence<Status = DefaultManualStatus>(options: ManualOptions<Status>, wsOptions?: ConnectionFunctions): (config: UserOptions, onStatusChange: ManualOnStatusChange<Status>) => ManualUser<Status>;
export function createPresence(options: AutoOptions, wsOptions?: ConnectionFunctions): (config: UserOptions, onStatusChange: AutoOnStatusChange) => AutoUser;
export function createPresence(options: Options, wsOptions?: ConnectionFunctions) {

  // this doesn't open the connection thou
  const connection = createWebsocket(wsOptions ?? {});

  // just constantly try to send a ping request
  setInterval(() => {
    console.log('attempting ping')
    connection.send('p')
  }, options.pingInterval * 1000)

  if (options.mode === "auto") {

    return createAutoPresence(options, connection);

  } else if (options.mode === "manual") {

    return createManualPresence(options, connection);

  } else {

    throw new Error(`The mode ${(options as any).mode} is not supported, choice either auto or manual`);

  }

}
