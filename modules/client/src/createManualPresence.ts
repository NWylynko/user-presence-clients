import type { Connection } from "./websocket";

export type DefaultManualStatus = "ONLINE" | "OFFLINE";

export type ManualOnStatusChange<Status = DefaultManualStatus> = (
  newStatus: Status
) => void | Promise<void>;

export interface ManualOptions<Status = DefaultManualStatus> {
  mode: "manual";
  api_key: string;
  disconnectedStatus: Status;
  connectedStatus: Status;
  onStatusChange: ManualOnStatusChange<Status>;
}

export interface UserOptions {
  userId: string;
}

export interface User<Status = DefaultManualStatus> {
  status: Status;
  setStatus: (newStatus: Status) => Status;
  connect: () => void;
}

export function createManualPresence<Status = DefaultManualStatus>(
  options: ManualOptions<Status>,
  connection: Connection
): ({ userId }: UserOptions) => User<Status> {
  return ({ userId }) => {
    let status: Status = options.disconnectedStatus;

    const connect = () => {
      connection.open()
      setStatus(options.connectedStatus)
    }
    const setStatus = (newStatus: Status) => {
      status = newStatus;

      options.onStatusChange(newStatus);

      return newStatus;
    };

    return {
      status,
      setStatus,
      connect
    };
  };
}
