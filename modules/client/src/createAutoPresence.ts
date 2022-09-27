import type { Connection } from "./websocket";
import type { UserOptions } from "./createManualPresence";

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
    let status: Status = "OFFLINE";

    const connect = async () => {
      const ws = await connection.open({
        auth: {
          api_key: options.api_key,
          userId,
        },
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

      console.log({ onStatusChange })

      onStatusChange(newStatus);

      return newStatus;
    };

    return {
      status,
      connect,
      disconnect,
    };
  };
}
