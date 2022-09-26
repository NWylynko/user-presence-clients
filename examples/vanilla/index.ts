
import { createPresence } from "@user-presence/client";

type status = "NAHYEAH" | "YEAHNAH" | "PARTY"

const presence = createPresence<status>({
  mode: "manual",
  api_key: "456",
  connectedStatus: "NAHYEAH",
  disconnectedStatus: "YEAHNAH",
  onStatusChange: (newStatus) => console.log({ online: newStatus === "NAHYEAH", newStatus }),
})

const user = presence({ userId: "123" })

console.log({ presence, user })
console.log({
  status: user.status
})

user.setStatus("PARTY")
user.setStatus("NAHYEAH")

const presence2 = createPresence({
  mode: "auto",
  api_key: "678",
  onStatusChange: (newStatus) => console.log({ newStatus }),
})

const user2 = presence2({ userId: "789" })

console.log({ presence2, user2 })
console.log({
  status: user2.status
})