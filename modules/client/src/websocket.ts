

export const openWebsocket = () => {

  const ws = new WebSocket("ws://localhost:4000")

  ws.onmessage = (e) => console.log(e);

  return ws;

}