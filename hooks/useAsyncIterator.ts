import {useState} from "react";

function cleanse<T>(valOrArray: T[] | T): T[] {
  return valOrArray instanceof Array ? valOrArray ?? [] : [valOrArray];
}

/** 'Lil quirk to note: if `newGenerator` changes, the state will be reset. If this is not intended behavior, hold it in state */
export default function useAsyncIterator<T>(newGenerator: AsyncIterator<T[] | T, void>) {
  const [response, setResponse] = useState<T[]>([]);
  // This prevents generator from starting from beginning every time re-called
  const [generator, setGenerator] = useState(newGenerator);
  if (newGenerator != generator) {
    console.log("GENERATOR EQUIVALENCY", newGenerator == generator, "(resetting async iterator state with new generator)");
    setGenerator(newGenerator);
    setResponse([]);
  }

  function next() {
    return generator.next().then(res => {
      // Only update state if there's a value (this prevents infinite loops if checking result length on state change and calling next if length == 0)
      // (since length will always be 0, no matter how many times next is called, if generator has no elements)
      if (res.value)
        // TODO: even though cleanse is supposed to remove null values, figure why I still need ?? []. Keyword: custom type guard
        setResponse(old => [...cleanse(old), ...cleanse(res.value ?? [])]);
    });
  }

  return [response, next] as const;
}
