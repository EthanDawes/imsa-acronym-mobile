/**
 * Learn more about Light and Dark modes:
 * https://docs.expo.io/guides/color-schemes/
 */

import {
  Pressable,
  PressableProps,
  StyleProp,
  Text as DefaultText,
  TextInput as DefaultTextInput, TextStyle,
  View, ViewStyle
} from 'react-native';

import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import {PropsWithChildren, useContext} from "react";
import Layout from "../constants/Layout";
import {SizeContext} from "../constants/context";

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors[keyof typeof Colors]
) {
  const theme = useColorScheme();
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme][colorName];
  }
}

type ThemeProps = {
  lightColor?: string;
  darkColor?: string;
};

export type TextProps = ThemeProps & DefaultText['props'];
export type ViewProps = ThemeProps & View['props'];

export function Text(props: TextProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
  const {item: size} = useContext(SizeContext);
  return <DefaultText style={[{ color, fontFamily: "helvetica", fontSize: Layout.defaultTextSize + size }, style]} {...otherProps} />;
}

export function Italics(props: TextProps) {
  const {style, ...otherProps} = props;
  return <Text style={[{ fontFamily: "helvetica", fontStyle: "italic" }, style]} {...otherProps} />
}

export function TextInput(props: DefaultTextInput['props']) {
  const { style, ...otherProps } = props;
  const colors = Colors[useColorScheme()];

  return <DefaultTextInput style={[{
    color: colors.text,
    borderColor: colors.text,
    borderWidth: 1,
    borderStyle: "solid",
    borderRadius: 5,
    height: 48,
    flexGrow: 100,
    paddingVertical: 5,
    paddingHorizontal: 15,
    alignSelf: "flex-start",  // this style makes container fit to content (like display: inline-block)
    alignItems: "center",
    flexDirection: "row", }, style]} placeholderTextColor={colors.shadow} {...otherProps} />;
}

export function LabeledTextInput(props: DefaultTextInput['props'] & TextProps & {textStyle?: StyleProp<TextStyle>, inputStyle?: StyleProp<TextStyle>}) {
  const {children, style, textStyle, inputStyle, ...otherProps} = props;
  return (
    <View style={[{flexDirection: "row", gap: 5, alignItems: "center"}, style]}>
      <Text style={textStyle} {...otherProps}>{children}</Text>
      <TextInput style={inputStyle} {...otherProps} />
    </View>
  );
}

// TODO: eh color & margin might need to be fixed
export function Hr({style}: {style?: StyleProp<ViewStyle>}) {
  return (<View style={[{
    marginVertical: 10,
    height: 1,
    // width: '100%',
    backgroundColor: useThemeColor({ light: "#b4b4b4", dark: "rgba(255,255,255,0.9)" }, 'background'),
  }, style]} />)
}

export function Bold(props: TextProps) {
  const { style, ...otherProps } = props;
  return (<Text style={[{fontFamily: "helvetica-bold"}, style]} {...otherProps} />);
}

export function Title(props: TextProps) {
  const { style, ...otherProps } = props;
  const {item: size} = useContext(SizeContext);
  return (<Bold style={[{fontSize: Layout.defaultTitleSize + size}, style]} {...otherProps} />);
}

export function CategoryLabel(props: DefaultText['props']) {
  const { style, ...otherProps } = props;
  const colors = Colors[useColorScheme()];
  return (<Bold style={[{color: colors.tint}, style]} {...otherProps} />);
}

// TODO: replace w/ TouchableRipple Component for Android & iOS
export function useAndroidRipple() {
  const colorScheme = useColorScheme();
  return {color: Colors[colorScheme].shadow, foreground: true};
}

export function RoundedButton(props: PressableProps & {color: keyof typeof Colors['light' | 'dark'], bold?: boolean}) {
  let {style, color, bold=false, ...otherProps} = props;
  const colors = Colors[useColorScheme()];
  if (typeof style === "function") {
    console.error("Why did you pass a style function? Don't do that");
    style = {};
  }
  return (
    <Pressable android_ripple={useAndroidRipple()} style={[{
      borderColor: colors[color],
      borderWidth: bold ? 2 : 1,
      borderStyle: "solid",
      borderRadius: 20,
      height: 48,
      paddingVertical: 5,
      paddingHorizontal: 15,
      alignSelf: "flex-start",  // this style makes container fit to content (like display: inline-block)
      alignItems: "center",
      flexDirection: "row",
    }, style]} {...otherProps} />
  );
}

export function ListItem(props: ViewProps) {
  return (
    <View style={{padding: 10, borderBottomWidth: 1}} {...props}>{props.children}<Hr /></View>
  )
}
