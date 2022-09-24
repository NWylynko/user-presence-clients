
export type DefaultManualStatus = "ONLINE" | "OFFLINE"

export type ManualOnStatusChange<Status = DefaultManualStatus> = (newStatus: Status) => void | Promise<void>

export interface ManualOptions<Status = DefaultManualStatus> {
  mode: "manual";
  disconnectedStatus: Status;
  connectedStatus: Status;
  onStatusChange: ManualOnStatusChange<Status>;
}

export interface ManualPresence<Status = DefaultManualStatus> {
  status: Status;
  setStatus: (newStatus: Status) => Status;
}

export function getManualPresence<Status = DefaultManualStatus>(options: ManualOptions<Status>, ws: WebSocket): ManualPresence<Status> {

  let status: Status = options.disconnectedStatus;

  console.log({ status })

  const setStatus = (newStatus: Status) => {
    status = newStatus

    options.onStatusChange(newStatus)

    return newStatus;
  }

  return {
    status,
    setStatus
  };
}
