import React, { createContext, useContext, useState } from "react";
import { createPresence } from "@user-presence/client"
import type { Options } from "@user-presence/client/dist/createPresence";
import type { AutoOptions, User as AutoUser, Status } from "@user-presence/client/dist/createAutoPresence";
import type { DefaultManualStatus, ManualOptions, UserOptions, User as ManualUser, } from "@user-presence/client/dist/createManualPresence";

type ProviderProps = { children: JSX.Element | JSX.Element[], user: UserOptions }
type Provider = (props: ProviderProps) => JSX.Element

type UseContext = (options?: { autoConnect: boolean }) => AutoUser;

interface AutoPresence {
  Provider: Provider;
  useContext: UseContext;
}

// omit on status change as we will use react state 
type AutoProviderOptions = Omit<AutoOptions, "onStatusChange">

const NoProviderError = () => { throw new Error(`You are trying to call this function outside of the provider :(`) }

type AutoContext = {
  connect: () => void;
  status: Status
}

export const createAutoProvider = (options: AutoProviderOptions) => {

  const Context = createContext<AutoContext>({
    status: "OFFLINE",
    connect: NoProviderError
  });

  const Provider: Provider = ({ children, user: userOptions }: ProviderProps) => {

    const [status, setStatus] = useState<Status>("OFFLINE")

    const instantiateUser = createPresence({ ...options, onStatusChange: setStatus })

    const user = instantiateUser(userOptions)

    return <Context.Provider value={{ ...user, status }}>{children}</Context.Provider>;
  };

  const usePresence: UseContext = (options) => {

    const { autoConnect } = options ?? { autoConnect: true }

    const context = useContext(Context)

    if (autoConnect === true) {
      context.connect()
    }

    return context;
  }

  return {
    Provider,
    useContext: usePresence
  }
}

interface ManualPresence<Status = DefaultManualStatus> {
  Provider: Provider;
  useContext: () => ManualUser<Status>
}

type ManualProviderOptions <Status = DefaultManualStatus> = Omit<ManualOptions<Status>, "onStatusChange">


export const createManualProvider = (options: ManualProviderOptions) => {

}

export function createPresenceProvider<Status = DefaultManualStatus>(options: ManualProviderOptions<Status>): ManualPresence<Status>;
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
