import { getAutoPresence } from "./getAutoPresence";
import type { AutoOptions, AuthPresence } from "./getAutoPresence";
import { getManualPresence } from "./getManualPresence";
import type { ManualOptions, ManualPresence, DefaultManualStatus } from "./getManualPresence";
import { openWebsocket } from "./websocket";

type Options = AutoOptions | ManualOptions

export function getPresence<Status = DefaultManualStatus>(options: ManualOptions<Status>): ManualPresence<Status>;
export function getPresence(options: AutoOptions): AuthPresence;
export function getPresence(options: Options) {

  const ws = openWebsocket();

  if (options.mode === "auto") {

    return getAutoPresence(options, ws);

  } else if (options.mode === "manual") {

    return getManualPresence(options, ws);

  } else {

    throw new Error(`The mode ${(options as any).mode} is not supported, choice either auto or manual`);

  }

}
