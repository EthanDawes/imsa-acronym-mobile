import {useCollapsibleHeader} from "react-navigation-collapsible";
import useColorScheme from "../hooks/useColorScheme";
import {DarkTheme, DefaultTheme} from "@react-navigation/native";
import {NativeScrollEvent, NativeSyntheticEvent} from "react-native";

export default function useCollapsibleHeaderMixin(scrollHandler: (event: NativeSyntheticEvent<NativeScrollEvent>) => void = () => {}) {
  const colorScheme = useColorScheme();

  const options = {
    navigationOptions: {
      headerStyle: { backgroundColor: colorScheme === 'dark' ? DarkTheme.colors.card : DefaultTheme.colors.card },
    },
  };
  const {
    onScrollWithListener /* Event handler creator */,
    containerPaddingTop /* number */,
    scrollIndicatorInsetTop /* number */,
  } = useCollapsibleHeader(options);

  const onScroll = onScrollWithListener(scrollHandler);
  // CollapsibleHeader docs: https://github.com/benevbright/react-navigation-collapsible

  return {
    onScroll,
    contentContainerStyle: { paddingTop: containerPaddingTop },
    scrollIndicatorInsets: { top: scrollIndicatorInsetTop },
  };
}
