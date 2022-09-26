
// one hour
const MAX_CONNECTION_TIME = 1000 * 60 * 60

// forcefully disconnect 10 seconds before instead of being kicked off
const connectionTime = MAX_CONNECTION_TIME - 10 * 1000

export const createWebsocket = () => {

  let ws: WebSocket | undefined = undefined;

  let connected = false;
  let loading = false;
  let error: string | undefined = undefined;

  let timeout: NodeJS.Timeout;

  const open = () => {

    connected = false;
    loading = true;
    error = undefined;

    ws = new WebSocket("wss://4000-nwylynko-userpresencews-jw6lgtmj84e.ws-us67.gitpod.io")

    ws.onopen = (event) => {

      console.log(`connection to ws is open`)

      connected = true;
      loading = false;
      error = undefined;

      timeout = setTimeout(() => {

        ws?.close();
        ws = undefined;

        open();
      }, connectionTime)

    }

    ws.onclose = (event) => {

      console.log(`connection to ws is closed`)

      connected = false;
      loading = false;
      error = undefined;
    }

    ws.onerror = (event) => {

      console.log(`connection to ws errored`)

      connected = false;
      loading = false;
      error = `Error while attempting to connect to user-presence`
    }

    return ws;

  }

  const close = () => {

    ws?.close();
    ws = undefined;
    clearTimeout(timeout);

    connected = false;
    loading = false;
    error = undefined;
  }

  return {
    ws,
    open,
    close,
    connected,
    loading,
    error
  };

}

export type Connection = ReturnType<typeof createWebsocket>