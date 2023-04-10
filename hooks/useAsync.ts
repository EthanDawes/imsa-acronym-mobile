import {useEffect, useState} from 'react';

// Wrap awaitable in a function b/c without it, it will be run every render, which can be computationally expensive if making net requests
export default function useAsync<S>(awaitable: () => Promise<S>, initialState: S): S;
export default function useAsync<S = undefined>(awaitable: () => Promise<S>): S | undefined;
export default function useAsync<T>(awaitable: () => Promise<T>, initialState?: T) {
  const [response, setResponse] = useState(initialState);

  useEffect(() => {
    awaitable().then(setResponse)
  }, []);

  return response;
}
