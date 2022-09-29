
import { createPresence, AutoStatus } from "@user-presence/client";

type Status = "NAHYEAH" | "YEAHNAH" | "PARTY"

const presence = createPresence<Status>({
  mode: "manual",
  api_key: "456",
  connectedStatus: "NAHYEAH",
  disconnectedStatus: "YEAHNAH",
  pingInterval: 20
})

const onStatusChange = (newStatus: Status) => console.log({ online: newStatus === "NAHYEAH", newStatus })

const user = presence({ userId: "123" }, onStatusChange)

await user.connect();

console.log({ presence, user })
console.log({
  status: user.status
})

user.setStatus("PARTY")
user.setStatus("NAHYEAH")

const presence2 = createPresence({
  mode: "auto",
  api_key: "678",
  pingInterval: 20
})

const onStatusChange2 = (newStatus: AutoStatus) => console.log({ newStatus })

const user2 = presence2({ userId: "789" }, onStatusChange2)

await user2.connect();


console.log({ presence2, user2 })
console.log({
  status: user2.status
})