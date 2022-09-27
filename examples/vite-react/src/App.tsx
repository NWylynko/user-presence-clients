import { usePresence } from "./presence";

function App() {
  // const presence = usePresence();

  // presence.connect();

  return (
    <div>
      {/* <pre>{JSON.stringify(presence, null, 2)}</pre> */}
      <SubComponent />
    </div>
  );
}

export default App;

const SubComponent = () => {
  const presence = usePresence();

  const backgroundColor = presence.status === "ONLINE" ? "green" : "red";

  return (
    <div>
      <div
        onClick={() => {
          // debugger;
          presence.connect();
        }}
        style={{ width: 32, height: 32, backgroundColor }}
      />
    </div>
  );
};
