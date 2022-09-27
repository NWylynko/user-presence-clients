import React, { createContext, useContext, useEffect, useState } from "react";
import { createPresence } from "@user-presence/client";
import type {
  DefaultManualStatus,
  ManualOptions,
  User as ManualUser,
} from "@user-presence/client/dist/createManualPresence";
import { NoProviderError } from "./NoProviderError";
import type { Provider } from "./createProvider";

type UseContext<Status> = () => ManualUser<Status>;

export interface ManualPresence<Status> {
  Provider: Provider;
  useContext: UseContext<Status>;
}

export type ManualProviderOptions<Status = DefaultManualStatus> = Omit<ManualOptions<Status>, "onStatusChange"> & {
  autoConnect?: boolean;
};

export function createManualProvider<Status = DefaultManualStatus>(
  options: ManualProviderOptions<Status>
): ManualPresence<Status> {
  const instantiateUser = createPresence<Status>(options);

  const Context = createContext<ManualUser<Status>>({
    status: options.disconnectedStatus,
    setStatus: NoProviderError,
    connect: NoProviderError,
    disconnect: NoProviderError,
  });

  const Provider: Provider = ({ children, user: userOptions }) => {
    const [status, setStatus] = useState<Status>(options.disconnectedStatus);

    const user = instantiateUser(userOptions, setStatus);

    return <Context.Provider value={{ ...user, status }}>{children}</Context.Provider>;
  };

  const usePresence: UseContext<Status> = () => useContext(Context);

  return {
    Provider,
    useContext: usePresence,
  };
}
