import { useEffect } from 'react';

export default function useOnResize(func: () => void) {
  useEffect(() => {
    document.addEventListener('resize', func);

    return () => document.removeEventListener('resize', func);
  }, [func]);
}
