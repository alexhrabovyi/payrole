import { useEffect } from 'react';

export default function useOnResize(func: () => void) {
  useEffect(() => {
    window.addEventListener('resize', func);

    return () => window.removeEventListener('resize', func);
  }, [func]);
}
