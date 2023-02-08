import {Dispatch, SetStateAction, useEffect, useState} from 'react';

export default function useAsync<S>(awaitable: Promise<S>, initialState: S): [S, Dispatch<SetStateAction<S>>];
export default function useAsync<S = undefined>(awaitable: Promise<S>): [S | undefined, Dispatch<SetStateAction<S | undefined>>];
export default function useAsync<T>(awaitable: Promise<T>, initialState?: T) {
  const [response, setResponse] = useState(initialState);

  useEffect(() => {
    awaitable.then(setResponse)
  }, []);

  return [response, setResponse] as const;
}
