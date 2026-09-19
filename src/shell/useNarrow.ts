import { useEffect, useState } from 'react';
import { NARROW_QUERY } from './phone_tabs';

export function useNarrow(query: string = NARROW_QUERY): boolean {
  const [narrow, setNarrow] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setNarrow(mql.matches);
    onChange();
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [query]);

  return narrow;
}
