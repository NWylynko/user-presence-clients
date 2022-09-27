import { createPresenceProvider } from "@user-presence/react";

const presence = createPresenceProvider({
  mode: "auto",
  api_key: "123456",
  pingInterval: 10 // in seconds
})

console.log({ presence })

export const PresenceProvider = presence.Provider;
export const usePresence = presence.useContext;