import {NativeScrollEvent, NativeSyntheticEvent} from "react-native";

/**
 * Constructs an infinite scroll handler
 * @param next function to call when more articles need to be loaded
 */
export default function constructInfiniteScrollHandler(next: () => void) {
  return ({nativeEvent}: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollTop = nativeEvent.contentOffset.y + nativeEvent.layoutMeasurement.height;
    const scrollHeight = nativeEvent.contentSize.height;
    const progress = scrollTop / scrollHeight * 100;
    // TODO: only load as many as user is going to see in the next second
    //const velocity = nativeEvent.velocity?.y;
    if (progress > 70) next();
  };
}
