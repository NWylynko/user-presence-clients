import React, { createContext, useContext, useEffect, useState } from "react";
import { createPresence } from "@user-presence/client";
import type { Provider } from "./createProvider";
import { NoProviderError } from "./NoProviderError";
import type { AutoOptions, User as AutoUser, Status } from "@user-presence/client/dist/createAutoPresence";

type UseContext = () => AutoUser;

export interface AutoPresence {
  Provider: Provider;
  useContext: UseContext;
}

// omit on status change as we will use react state
export type AutoProviderOptions = Omit<AutoOptions, "onStatusChange"> & {
  autoConnect?: boolean;
};

export const createAutoProvider = (options: AutoProviderOptions): AutoPresence => {
  const instantiateUser = createPresence(options);

  const Context = createContext<AutoUser>({
    status: "OFFLINE",
    connect: NoProviderError,
    disconnect: NoProviderError,
  });

  const Provider: Provider = ({ children, user: userOptions }) => {
    const [status, setStatus] = useState<Status>("OFFLINE");

    const user = instantiateUser(userOptions, setStatus);

    useEffect(() => {
      if (options.autoConnect) {
        user.connect();
        return () => {
          user.disconnect();
        };
      }
    }, []);

    // here we overwrite the variable status with a react state status
    const values = { ...user, status };

    return <Context.Provider value={values}>{children}</Context.Provider>;
  };

  const usePresence: UseContext = () => useContext(Context);

  return {
    Provider,
    useContext: usePresence,
  };
};
