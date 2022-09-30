

export const visibility = (setOnline: Function, setAway: Function) => {

  const onChange = () => {

    const visible = document.visibilityState === 'visible';

    if (visible) {
      setOnline()
    } else {
      setAway();
    }

  }

  document.addEventListener("visibilitychange", onChange);

  // we wont to run it once on load in-case the window just loaded in the background
  onChange()
}