import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { PresenceProvider } from "./presence";

// here I am disabling strict mode as it forces everything to run twice
// while in development mode, this is annoying as it opens up two
// connections to the ws service

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <>
    {/* <React.StrictMode> */}
    <PresenceProvider user={{ userId: "123" }}>
      <App />
    </PresenceProvider>
    {/* </React.StrictMode> */}
  </>
);
