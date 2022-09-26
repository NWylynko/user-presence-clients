import { useEffect } from "react";
import { usePresence } from "./presence"

function App() {

  const presence = usePresence();

  return (
    <div>
      <pre>{JSON.stringify(presence, null, 2)}</pre>
    </div>
    )
}

export default App
