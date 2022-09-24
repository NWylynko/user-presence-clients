
import { getPresence } from "@user-presence/client";

type status = "NAHYEAH" | "YEAHNAH" | "PARTY"

const presence = getPresence<status>({
  mode: "manual",
  connectedStatus: "NAHYEAH",
  disconnectedStatus: "YEAHNAH",
  onStatusChange: (newStatus) => console.log({ online: newStatus === "NAHYEAH", newStatus })
})

console.log({ presence })
console.log({
  status: presence.status
})

presence.setStatus("PARTY")
presence.setStatus("NAHYEAH")

const presence2 = getPresence({
  mode: "auto",
  onStatusChange: (newStatus) => console.log({ newStatus })
})

console.log({ presence2 })
console.log({
  status: presence2.status
})