import { useEffect, useState } from 'react';
import { getDevicePixelRatio } from './images';

// Tracks devicePixelRatio, which changes with browser zoom or when the window
// moves to a display with a different pixel density.
export default function useDevicePixelRatio() {
  const [dpr, setDpr] = useState(getDevicePixelRatio);

  useEffect(() => {
    let mql;
    const onChange = () => {
      setDpr(getDevicePixelRatio());
      listen();
    };
    const listen = () => {
      mql = window.matchMedia(`(resolution: ${getDevicePixelRatio()}dppx)`);
      mql.addEventListener('change', onChange, { once: true });
    };
    listen();
    return () => mql.removeEventListener('change', onChange);
  }, []);

  return dpr;
}
