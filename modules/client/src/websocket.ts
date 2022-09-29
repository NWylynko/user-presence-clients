import { createStringQueue } from "./stringQueue"

const URL = "ws://localhost:3050"

// one hour
const MAX_CONNECTION_TIME = 1000 * 70
// const MAX_CONNECTION_TIME = 1000 * 60 * 60

// forcefully disconnect 10 seconds before instead of being kicked off
const connectionTime = MAX_CONNECTION_TIME - 10 * 1000

const defaultVoidFunctions = {

  onConnect: () => {
    // console.log('connected :)');
  },
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

  const { state: connected, setState: setConnected, getState: isConnected } = useBooleanState({
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
  let failedAttempts = 0

  const open = (options: OpenOptions) => {

    return new Promise<WebSocket | undefined>((resolve, reject) => {

      setConnected(false);
      setLoading(true);
      setError(undefined);

      ws = new WebSocket(URL)

      ws.onopen = (event) => {

        if (ws) {

          setConnected(true);
          setLoading(false);
          setError(undefined);

          // essentially this is being called twice on first connect
          // but that's not the end of the world lol
          send({ e: "auth", key: options.auth.api_key, id: options.auth.userId })

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

        failedAttempts++;

        setConnected(false);
        setLoading(false);
        setError(`Error while attempting to connect to user-presence`)

        if (failedAttempts < 3) {
          open(options)
        }

        reject(`Error while attempting to connect to user-presence`)
      }

    })

  }

  const close = () => {

    return new Promise<void>((resolve, reject) => {

      clearTimeout(timeout);

      if (ws) {
        ws.onclose = (event) => {

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

  const msgQueue = createStringQueue((msg) => {
    const ws = getWS();
    const open = isOpen()

    if (open) {
      ws.send(msg)
    } else {
      throw new Error(`Connection isn't open yet`)
    }
  })

  const send = (message: string | object) => {
    if (typeof message === "object") {
      msgQueue.add(JSON.stringify(message))
    } else if (typeof message === "string") {
      msgQueue.add(message);
    } else {
      throw new Error('sorry that message type is not currently supported :/')
    }
  }

  const getWS = () => ws;

  const isOpen = isConnected

  return {
    getWS,
    isOpen,
    open,
    close,
    connected,
    loading,
    error,
    send
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
    state = newState;

    newState ? options.onTrue() : options.onFalse();
    options.onToggle(newState);

    return newState
  }

  const getState = () => state;

  return {
    state,
    setState,
    getState
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

  const getState = () => state;

  return {
    state,
    setState,
    getState
  }
}