import {DarkTheme, DefaultTheme} from "@react-navigation/native";

const tintColorLight = '#a90003';
const tintColorDark = '#fff';

export default {
  light: {
    text: '#000',
    background: '#fff',
    tint: tintColorLight,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorLight,
    shadow: 'rgba(0,0,0,0.4)',
    header: DefaultTheme.colors.card,
  },
  dark: {
    text: '#fff',
    background: '#000',
    tint: tintColorDark,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorDark,
    shadow: 'rgba(255,255,255,0.4)',
    header: DarkTheme.colors.card,
  },
};
