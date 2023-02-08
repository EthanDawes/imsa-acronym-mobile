import useAsync from "./useAsync";

export default function useAsyncList<T>(awaitable: Promise<T[]>): T;
export default function useAsyncList<T>(awaitable: Promise<T[]>, next: () => Promise<T[]>): [T, () => void];
export default function useAsyncList<T>(awaitable: Promise<T[]>, next?: () => Promise<T[]>) {
  const [response, setResponse] = useAsync(awaitable, []);

  function goNext() {
    if (!next) return;  // This'll never happen
    next().then(res => {
      setResponse(old => [...(old ?? []), ...res]);
    });
  }

  if (next)
    return [response, goNext] as const;
  return response;
}
