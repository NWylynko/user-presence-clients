import type { DefaultManualStatus, UserOptions } from "@user-presence/client/dist/createManualPresence";
import { createAutoProvider } from "./createAutoProvider";
import type { AutoPresence, AutoProviderOptions } from "./createAutoProvider";
import { createManualProvider } from "./createManualProvider";
import type { ManualProviderOptions, ManualPresence } from "./createManualProvider";

export type ProviderProps = { children: JSX.Element | JSX.Element[]; user: UserOptions };
export type Provider = (props: ProviderProps) => JSX.Element;

export function createPresenceProvider<Status = DefaultManualStatus>(
  options: ManualProviderOptions<Status>
): ManualPresence<Status>;
export function createPresenceProvider(options: AutoProviderOptions): AutoPresence;
export function createPresenceProvider(options: AutoProviderOptions | ManualProviderOptions) {
  if (options.mode === "auto") {
    return createAutoProvider(options);
  } else if (options.mode === "manual") {
    return createManualProvider(options);
  } else {
    throw new Error(`The mode ${(options as any).mode} is not supported, choice either auto or manual`);
  }
}
