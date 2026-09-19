import { useEffect, useState } from 'react';

const KEYBOARD_COVER_PX = 80;

export function useKeyboardOpen(thresholdPx: number = KEYBOARD_COVER_PX): boolean {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;

    const sync = () => {
      const covered = window.innerHeight - vv.height > thresholdPx;
      setOpen(covered);
      document.documentElement.style.setProperty('--vv-height', `${Math.round(vv.height)}px`);
      document.documentElement.style.setProperty('--vv-offset-top', `${Math.round(vv.offsetTop)}px`);
    };

    sync();
    vv.addEventListener('resize', sync);
    vv.addEventListener('scroll', sync);
    window.addEventListener('orientationchange', sync);
    return () => {
      vv.removeEventListener('resize', sync);
      vv.removeEventListener('scroll', sync);
      window.removeEventListener('orientationchange', sync);
    };
  }, [thresholdPx]);

  return open;
}
