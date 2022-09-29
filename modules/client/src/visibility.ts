

export const visibility = (setOnline: Function, setAway: Function) => {

  const onChange = (ev: Event) => {

    const visible = document.visibilityState === 'visible';

    if (visible) {
      setOnline()
    } else {
      setAway();
    }

  }

  document.addEventListener("visibilitychange", onChange);
}