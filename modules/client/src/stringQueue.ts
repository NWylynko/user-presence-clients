

// the idea here is a queue that takes a function that takes a string as a parameter
// then return a function that adds a string to a queue
// then when there are items in the queue it attempts to call the function
// with the strings
// if it fails it just keeps retrying it until it goes through
// this is being used for sending messages over a websocket connection
// we want them to send in the right order
// we will use a timeout of 100ms for retries
export const createStringQueue = (fn: (message: string) => void) => {

  let queue: string[] = []

  // a lock to ensure it only runs through the queue once and in order
  let running = false;

  const add = (message: string) => {

    // console.log('added', message, 'to queue')

    queue.push(message);

    run();

  }

  const run = () => {

    // if its already running then don't try to run again
    if (running) return;
    running = true;

    // using for loop for nice syntax
    for (const _ in queue) {

      // shift takes the first item out of the queue and gives it to us
      const message = queue.shift()

      try {

        // attempt to run the function
        fn(message)

        continue;

      } catch (error: any) {
        // console.error('in Queue:', error.message);

        // add it back to the start of the queue
        queue.unshift(message);

        // allow it to run again
        running = false;

        // give it 100ms to before trying again
        setTimeout(run, 100)

        break;

      }
    }

    running = false;

  }

  return {
    add,
    length: () => queue.length,
  }

}
