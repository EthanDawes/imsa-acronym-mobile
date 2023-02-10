import {Dispatch, SetStateAction, useEffect, useState} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function useAsyncStorage<S>(key: string, initialState: S): [S, Dispatch<SetStateAction<S>>];
export default function useAsyncStorage<S = undefined>(key: string): [S, Dispatch<SetStateAction<S | undefined>>];
export default function useAsyncStorage<S>(key: string, initialState?: S) {
  const [state, setState] = useState(initialState);

  // Load from storage, if exists
  useEffect(() => {
    AsyncStorage.getItem(key).then(item => {
      if (item != null) setState(JSON.parse(item));
    });
  }, []);

  function setStateWrapper(newState: SetStateAction<S | undefined>) {
    setState(oldState => {
      // For some reason, typeof newState === "function" does not work https://github.com/microsoft/TypeScript/issues/37663
      if (newState instanceof Function)
        newState = newState(oldState);
      AsyncStorage.setItem(key, JSON.stringify(newState));
      return newState;
    });
  }

  return [state, setStateWrapper] as const;
}
