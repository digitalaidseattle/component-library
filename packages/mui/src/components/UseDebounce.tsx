/**
*  UseDebounce.tsx
*
* 
* <pre> 
export default function SearchField() {
  const [value, setValue] = useState('');
  const debounced = useDebounce(value, 500);

  useEffect(() => {
    if (debounced) {
      console.log('Search:', debounced);
    }
  }, [debounced]);

  return (
    <TextField
      label="Search"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      fullWidth
    />
  );
}
* </pre>
*  @copyright 2026 Digital Aid Seattle
*
*/

import { useEffect, useState } from 'react';

export function useDebounce<T>(value: T, delay: number) {
    const [debounced, setDebounced] = useState(value);

    useEffect(() => {
        const timer = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(timer);
    }, [value, delay]);

    return debounced;
}