import useAsync from "./useAsync";
import {useEffect, useState} from "react";

function cleanse<T>(valOrArray: T[] | T): T[] {
  return valOrArray instanceof Array ? valOrArray ?? [] : [valOrArray];
}

export default function useAsyncIterator<T>(newGenerator: AsyncIterator<T[] | T, void>) {
  const [response, setResponse] = useState<T[]>([]);
  const [generator, setGenerator] = useState(newGenerator);
  if (newGenerator != generator) {
    console.log("GENERATOR EQUIVALENCY", newGenerator == generator, "(resetting async iterator state with new generator)");
    setGenerator(newGenerator);
  }

  function next() {
    return generator.next().then(res => {
      // TODO: even though cleanse is supposed to remove null values, figure why I still need ?? []. Keyword: custom type guard
      setResponse(old => [...cleanse(old), ...cleanse(res.value ?? [])]);
    });
  }

  return [response, next] as const;
}
