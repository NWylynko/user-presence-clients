import { visibility } from "./visibility";
import { type ConnectionFunctions, createWebsocket } from "./websocket";

export type DefaultStatus = "ONLINE" | "AWAY" | "OFFLINE"

export type Options<Status> = {
  api_key: string;
  pingInterval: number;
  disconnectedStatus?: Status;
  connectedStatus?: Status;
  away?: Away<Status>;
}

export type Away<Status> = ({
  auto: true;
  status?: Status;
} | {
  auto: false;
  status?: undefined;
})

export interface UserOptions {
  userId: string;
}

export type OnStatusChange<Status = DefaultStatus> = (
  newStatus: Status
) => void | Promise<void>;

export interface User<Status = DefaultStatus> {
  status: Status;
  setStatus: (newStatus: Status) => Status;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
}

export const createPresence = <Status = DefaultStatus>(options: Options<Status>, wsOptions?: ConnectionFunctions) => {

  const mergedOptions: Options<Status> = {
    // @ts-ignore
    disconnectedStatus: "OFFLINE",
    // @ts-ignore
    connectedStatus: "ONLINE",
    away: {
      auto: true,
    },
    ...options
  }

  const connection = createWebsocket(wsOptions);

  // just constantly try to send a ping request
  setInterval(() => {
    connection.send('p')
  }, mergedOptions.pingInterval * 1000)

  return ({ userId }: UserOptions, onStatusChange: OnStatusChange<Status>) => {

    // send this straight away to its top of the queue
    connection.send({ e: "auth", key: mergedOptions.api_key, id: userId })

    let status = mergedOptions.disconnectedStatus;

    const connect = async () => {
      const ws = await connection.open({
        auth: {
          api_key: mergedOptions.api_key,
          userId: userId
        }
      })

      if (ws) {
        setStatus(mergedOptions.connectedStatus)
      }

    }

    const disconnect = async () => {
      await connection.close();
      setStatus(mergedOptions.disconnectedStatus);
    }

    const setStatus = (newStatus: Status) => {
      status = newStatus;

      onStatusChange(newStatus);

      connection.send({ e: "stat", s: newStatus })

      return newStatus;
    };

    if (mergedOptions.away.auto === true) {
      visibility(
        () => setStatus(mergedOptions.connectedStatus),
        () => setStatus(mergedOptions.away.status)
      )
    }

    return {
      status,
      setStatus,
      connect,
      disconnect
    };

  }
}