
const URL = "ws://localhost:4000"

// one hour
const MAX_CONNECTION_TIME = 1000 * 70
// const MAX_CONNECTION_TIME = 1000 * 60 * 60

// forcefully disconnect 10 seconds before instead of being kicked off
const connectionTime = MAX_CONNECTION_TIME - 10 * 1000

const defaultVoidFunctions = {

  onConnect: () => { },
  onDisconnect: () => { },
  onConnectionChange: (connected: boolean) => { },

  onStartLoading: () => { },
  onStopLoading: () => { },
  onLoadingChange: (loading: boolean) => { },

  onError: (error: string) => { },
  onErrorChange: (error: string | undefined) => { },

}

export type ConnectionFunctions = Partial<typeof defaultVoidFunctions>

interface OpenOptions {
  auth: {
    api_key: string;
    userId: string;
  }
}

export const createWebsocket = (customFunctions: ConnectionFunctions) => {

  // this is just to make calling the functions cleaner
  // as we don't have to check if they are defined or not
  const functions = { ...defaultVoidFunctions, ...customFunctions }

  let ws: WebSocket | undefined;

  const { state: connected, setState: setConnected } = useBooleanState({
    initialState: false,
    onTrue: functions.onConnect,
    onFalse: functions.onDisconnect,
    onToggle: functions.onConnectionChange,
  });

  const { state: loading, setState: setLoading } = useBooleanState({
    initialState: false,
    onTrue: functions.onStartLoading,
    onFalse: functions.onStopLoading,
    onToggle: functions.onLoadingChange,
  })

  const { state: error, setState: setError } = useStringState({
    initialState: undefined,
    onString: functions.onError,
    onStringChange: functions.onErrorChange
  })

  let timeout: NodeJS.Timeout; // used to open and close connection to ws service

  const open = (options: OpenOptions) => {

    return new Promise<WebSocket | undefined>((resolve, reject) => {


      setConnected(false);
      setLoading(true);
      setError(undefined);

      ws = new WebSocket(URL)

      ws.onopen = (event) => {

        if (ws) {

          console.log(`connection to ws is open`)

          setConnected(true);
          setLoading(false);
          setError(undefined);

          ws.send(JSON.stringify({ e: "auth", key: options.auth.api_key, id: options.auth.userId }))

          timeout = setTimeout(() => {

            // we don't want to call the close function here
            // because we want it to be transparent that we
            // are reconnecting to the ws service

            // so we silently close the websocket connection
            // and reopen it calling this function recursively

            ws?.close();
            ws = undefined;

            open(options);
          }, connectionTime)

        } else {
          throw new Error(`ws.onopen was called but ws is undefined`)
        }

        resolve(ws);

      }

      ws.onerror = (event) => {

        console.log(`connection to ws errored`)

        setConnected(false);
        setLoading(false);
        setError(`Error while attempting to connect to user-presence`)

        reject(`Error while attempting to connect to user-presence`)
      }

    })

  }

  const close = () => {

    return new Promise<void>((resolve, reject) => {

      clearTimeout(timeout);

      if (ws) {
        ws.onclose = (event) => {

          console.log(`connection to ws is closed`)

          setConnected(false);
          setLoading(false);
          setError(undefined);

          resolve();

        }
      } else {
        resolve();
      }

      ws?.close();
      ws = undefined;

    })

  }

  const getWS = () => ws;

  return {
    getWS,
    open,
    close,
    connected,
    loading,
    error
  };

}

export type Connection = ReturnType<typeof createWebsocket>

interface BooleanStateOptions {
  initialState: boolean;
  onTrue: () => void;
  onFalse: () => void;
  onToggle: (state: boolean) => void;
}

const useBooleanState = (options: BooleanStateOptions) => {
  let state = options.initialState

  const setState = (newState: boolean) => {
    newState ? options.onTrue() : options.onFalse();
    options.onToggle(newState);

    return newState
  }

  return {
    state,
    setState
  }
}

interface StringStateOptions {
  initialState: string | undefined;
  onString: (state: string) => void;
  onStringChange: (state: string | undefined) => void;
}

const useStringState = (options: StringStateOptions) => {
  let state = options.initialState;

  const setState = (newState: string | undefined) => {
    state = newState;

    if (newState !== undefined) {
      options.onString(newState)
    };

    options.onStringChange(newState);

    return newState;
  }

  return {
    state,
    setState
  }
}