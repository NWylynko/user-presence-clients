import type { Connection } from "./websocket";

export type DefaultManualStatus = "ONLINE" | "OFFLINE";

export type ManualOnStatusChange<Status = DefaultManualStatus> = (
  newStatus: Status
) => void | Promise<void>;

export interface ManualOptions<Status = DefaultManualStatus> {
  mode: "manual";
  api_key: string;
  pingInterval: number;
  disconnectedStatus: Status;
  connectedStatus: Status;
}

export interface UserOptions {
  userId: string;
}

export interface User<Status = DefaultManualStatus> {
  status: Status;
  setStatus: (newStatus: Status) => Status;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
}

export function createManualPresence<Status = DefaultManualStatus>(
  options: ManualOptions<Status>,
  connection: Connection
): ({ userId }: UserOptions, onStatusChange: ManualOnStatusChange<Status>) => User<Status> {
  return ({ userId }, onStatusChange) => {
    let status: Status = options.disconnectedStatus;
    let interval: NodeJS.Timer;

    const connect = async () => {
      const ws = await connection.open({
        auth: {
          api_key: options.api_key,
          userId
        }
      })

      if (ws) {
        setStatus(options.connectedStatus)
      }

    }

    const disconnect = async () => {
      await connection.close();
      setStatus(options.disconnectedStatus);

      clearInterval(interval)
    }

    const setStatus = (newStatus: Status) => {
      status = newStatus;

      onStatusChange(newStatus);

      connection.send({ e: "stat", s: newStatus })

      return newStatus;
    };

    return {
      status,
      setStatus,
      connect,
      disconnect
    };
  };
}
