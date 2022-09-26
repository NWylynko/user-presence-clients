import type { Connection } from "./websocket";
import type { UserOptions } from "./createManualPresence"

export type Status = "OFFLINE" | "ONLINE" | "AWAY";

export type AutoOnStatusChange = (newStatus: Status) => void | Promise<void>;

export interface AutoOptions {
  mode: "auto";
  api_key: string;
  onStatusChange: AutoOnStatusChange;
}

export interface User {
  status: Status;
  connect: () => void;
}

export function createAutoPresence(
  options: AutoOptions,
  connection: Connection
): ({ userId }: UserOptions) => User {
  return ({ userId }) => {
    let status: Status = "OFFLINE";

    const connect = () => {
      const ws = connection.open()

      // connection.ws
      // setStatus("ONLINE")
    }

    const setStatus = (newStatus: Status) => {
      status = newStatus;

      options.onStatusChange(newStatus);

      return newStatus;
    };

    return {
      status,
      connect
    };
  };
}
