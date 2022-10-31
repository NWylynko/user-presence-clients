
import { createPresence, DefaultStatus } from "@user-presence/client";

type Status = "NAHYEAH" | "YEAHNAH" | "PARTY" | "NOT-HERE"

const presence = createPresence<Status>({
  api_key: "456",
  connectedStatus: "NAHYEAH",
  disconnectedStatus: "YEAHNAH",
  pingInterval: 5,
  away: {
    auto: true,
    status: "NOT-HERE"
  }
})

// const onStatusChange = (newStatus: Status) => console.log({ online: newStatus === "NAHYEAH", newStatus })
const onStatusChange = (newStatus: Status) => { }

const user = presence({ userId: "123" }, onStatusChange)

user.setStatus("PARTY")
user.setStatus("NAHYEAH")

await user.connect();

user.setStatus("PARTY")

const presence2 = createPresence({
  api_key: "678",
  pingInterval: 5,
  away: {
    auto: false
  }
})

// const onStatusChange2 = (newStatus: DefaultStatus) => console.log({ newStatus })
const onStatusChange2 = (newStatus: DefaultStatus) => { }

const user2 = presence2({ userId: "789" }, onStatusChange2)

await user2.connect();
