// from https://github.com/guillaume-gomez/tile-and-square/blob/main/src/CustomHooks/useWindowSize.tsx
import { useState, useLayoutEffect } from "react";

export default function useWindowSize(callback? : (width: number, height: number) => void ) {
  const [size, setSize] = useState<[number, number]>([0, 0]);

  useLayoutEffect(() => {
    function updateSize() {
      setSize([window.innerWidth, window.innerHeight]);
      if(callback) {
        callback(window.innerWidth, window.innerHeight);
      }
    }
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  return size;
}