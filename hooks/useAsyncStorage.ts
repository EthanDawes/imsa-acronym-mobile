import {Dispatch, SetStateAction, useEffect, useState} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type commonReturn<S> = {item: S, mergeItem: (newState: S) => void, removeItem: () => void};
export default function useAsyncStorage<S>(key: string, initialState: S): commonReturn<S> & {setItem: Dispatch<SetStateAction<S>>};
export default function useAsyncStorage<S = undefined>(key: string): commonReturn<S> & {setItem: Dispatch<SetStateAction<S | undefined>>};
export default function useAsyncStorage<S>(key: string, initialState?: S) {
  const [state, setState] = useState(initialState);

  // Load from storage, if exists
  useEffect(() => {
    AsyncStorage.getItem(key).then(item => {
      if (item != null) setState(JSON.parse(item));
    });
  }, []);

  function setItem(newState: SetStateAction<S | undefined>) {
    setState(oldState => {
      // For some reason, typeof newState === "function" does not work https://github.com/microsoft/TypeScript/issues/37663
      if (newState instanceof Function)
        newState = newState(oldState);
      AsyncStorage.setItem(key, JSON.stringify(newState));
      return newState;
    });
  }

  function mergeItem(newState: S) {
    // Technically, there will be a delay between merge item & state change, but it should be insignificant.
    // This way I don't have to merge myself & behavior is consistent
    // Or, maybe I should make all my functions like this to ensure AsyncStorage & state are always in sync (slim chance of error though, low priority)
    // `newState` is an object, not a function b/c I don't need to worry about the previous state b/c `mergeItem` is the source of truth. Therefore, it is OK to use state when calling this function
    AsyncStorage.mergeItem(key, JSON.stringify(newState), (err) => console.log("err", err)).then(console.log);
  }

  function removeItem() {
    AsyncStorage.removeItem(key);
    setState(initialState);
  }

  return {item: state, setItem, mergeItem, removeItem} as const;
}
