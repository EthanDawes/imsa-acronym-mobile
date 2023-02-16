// Adapted from https://github.com/juliencrn/usehooks-ts/blob/master/src/useDebounce/useDebounce.ts
// Docs https://usehooks-ts.com/react-hook/use-debounce

import { useEffect, useState } from 'react'

function useDebounce<T>(value: T, delay?: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay || 500)

    return () => {
      clearTimeout(timer)
    }
  }, [value, delay])

  return debouncedValue
}

export default useDebounce;
