/**
 * Learn more about Light and Dark modes:
 * https://docs.expo.io/guides/color-schemes/
 */

import {Text as DefaultText, TextInput as DefaultTextInput, View as DefaultView} from 'react-native';

import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const theme = useColorScheme();
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return ;
  } else {
    return Colors[theme][colorName];
  }
}

type ThemeProps = {
  lightColor?: string;
  darkColor?: string;
};

export type TextProps = ThemeProps & DefaultText['props'];
export type ViewProps = ThemeProps & DefaultView['props'];

export function Text(props: TextProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return <DefaultText style={[{ color, fontFamily: "helvetica" }, style]} {...otherProps} />;
}

export function TextInput(props: DefaultTextInput['props']) {
  const { style, ...otherProps } = props;
  const colors = Colors[useColorScheme()];

  return <DefaultTextInput style={[{ color: colors.text }, style]} placeholderTextColor={colors.shadow} {...otherProps} />;
}

export function View(props: ViewProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

  return <DefaultView style={[{ backgroundColor }, style]} {...otherProps} />;
}

// TODO: eh color & margin might need to be fixed
export function Hr() {
  return (<View style={{
    marginVertical: 10,
    height: 1,
    width: '100%',
  }} lightColor="#eee" darkColor="rgba(255,255,255,0.9)" />)
}

export function Title(props: TextProps) {
  const { style, ...otherProps } = props;
  return (<Text style={[{fontSize: 20, fontFamily: "helvetica-bold"}, style]} {...otherProps} />);
}

// TODO: replace w/ TouchableRipple Component for Android & iOS
export function useAndroidRipple() {
  const colorScheme = useColorScheme();
  return {color: Colors[colorScheme].shadow, foreground: true};
}

export function ListItem(props: ViewProps) {
  return (
    <View style={{padding: 10, borderBottomWidth: 1}} {...props}>{props.children}<Hr /></View>
  )
}
