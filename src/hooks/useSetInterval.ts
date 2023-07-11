import { useState, useRef } from 'react';


function useSetInterval() {
  const refFunction = useRef<null|number>(null);
  const [isIntervalRunning, setIsIntervalRunning] = useState<boolean>(false);

  function startInterval(callback: Function, timer: number) {
    if(refFunction.current) {
      stopInterval();
    }
    setIsIntervalRunning(true);
    const ref = setInterval(() => callback(), timer);
    refFunction.current = ref;
  }

  function stopInterval() {
    if(!refFunction.current) {
      return;
    }
    clearTimeout(refFunction.current);
    refFunction.current = null;
    setIsIntervalRunning(false);
  }

  return { startInterval, stopInterval, isIntervalRunning }

}

export default useSetInterval;