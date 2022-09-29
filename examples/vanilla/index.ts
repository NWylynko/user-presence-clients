
import { createPresence, AutoStatus } from "@user-presence/client";

type Status = "NAHYEAH" | "YEAHNAH" | "PARTY"

const presence = createPresence<Status>({
  mode: "manual",
  api_key: "456",
  connectedStatus: "NAHYEAH",
  disconnectedStatus: "YEAHNAH",
  pingInterval: 5
})

// const onStatusChange = (newStatus: Status) => console.log({ online: newStatus === "NAHYEAH", newStatus })
const onStatusChange = (newStatus: Status) => { }

const user = presence({ userId: "123" }, onStatusChange)

// console.log({
//   status: user.status
// })

user.setStatus("PARTY")
user.setStatus("NAHYEAH")

await user.connect();

user.setStatus("PARTY")

const presence2 = createPresence({
  mode: "auto",
  api_key: "678",
  pingInterval: 5
})

// const onStatusChange2 = (newStatus: AutoStatus) => console.log({ newStatus })
const onStatusChange2 = (newStatus: AutoStatus) => { }

const user2 = presence2({ userId: "789" }, onStatusChange2)

await user2.connect();

// // console.log({
// //   status: user2.status
// // })