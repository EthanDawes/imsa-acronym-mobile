import useColorScheme from "../hooks/useColorScheme";
import {DarkTheme, DefaultTheme} from "@react-navigation/native";
import {useCollapsibleHeader} from "react-navigation-collapsible";
import {Animated, FlatListProps} from "react-native";
import AnimatedProps = Animated.AnimatedProps;

export default function CollapsibleFlatList<ItemT>(props: AnimatedProps<FlatListProps<ItemT>>) {
  const {onScroll, contentContainerStyle, scrollIndicatorInsets, ...otherProps} = props;
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

  return (
    <Animated.FlatList
      onScroll={onScrollWithListener(onScroll ?? (() => {}))}
      contentContainerStyle={[contentContainerStyle, { paddingTop: containerPaddingTop }]}
      scrollIndicatorInsets={{ ...scrollIndicatorInsets, top: scrollIndicatorInsetTop }}
      {...otherProps}
    />
  );
}
