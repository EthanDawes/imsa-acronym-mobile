import useAsync from "./useAsync";
import {useEffect, useState} from "react";

export default function useAsyncIterator<T>(generator: AsyncIterator<T[], void>) {
  const [response, setResponse] = useState<T[]>([]);

  useEffect(next, []);  // Populate the array the first time

  function next() {
    generator.next().then(res => {
      setResponse(old => [...(old ?? []), ...(res.value ?? [])]);
    });
  }

  return [response, next] as const;
}
