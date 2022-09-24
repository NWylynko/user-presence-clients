
type Status = "OFFLINE" | "ONLINE" | "AWAY"

export type AutoOnStatusChange = (newStatus: Status) => void | Promise<void>

export interface AutoOptions {
  mode: "auto";
  onStatusChange: AutoOnStatusChange
}

export interface AuthPresence {
  status: Status;
  setStatus: (newStatus: Status) => Status;
}

export function getAutoPresence(options: AutoOptions, ws: WebSocket): AuthPresence {

  let status: Status = "OFFLINE";

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
