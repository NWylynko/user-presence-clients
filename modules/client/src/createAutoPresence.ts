import type { Connection } from "./websocket";
import type { UserOptions } from "./createManualPresence";
import { visibility } from "./visibility";

export type Status = "OFFLINE" | "ONLINE" | "AWAY";

export type AutoOnStatusChange = (newStatus: Status) => void | Promise<void>;

export interface AutoOptions {
  mode: "auto";
  api_key: string;
  pingInterval: number;
}

export interface User {
  status: Status;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
}

export function createAutoPresence(
  options: AutoOptions,
  connection: Connection
): ({ userId }: UserOptions, onStatusChange: AutoOnStatusChange) => User {
  return ({ userId }, onStatusChange) => {

    // send this straight away to its top of the queue
    connection.send({ e: "auth", key: options.api_key, id: userId })

    let status: Status = "OFFLINE";

    const connect = async () => {
      const ws = await connection.open({
        auth: {
          api_key: options.api_key,
          userId: userId
        }
      });

      if (ws) {
        setStatus("ONLINE");
      }
    };

    const disconnect = async () => {
      await connection.close();
      setStatus("OFFLINE");
    };

    const setStatus = (newStatus: Status) => {
      status = newStatus;

      onStatusChange(newStatus);

      connection.send({ e: "stat", s: newStatus })

      return newStatus;
    };

    visibility(() => setStatus("ONLINE"), () => setStatus("AWAY"))

    return {
      status,
      connect,
      disconnect,
    };
  };
}
