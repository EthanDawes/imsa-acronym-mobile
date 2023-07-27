import {
  ColorSchemeName,
  useColorScheme as _useColorScheme,
} from "react-native";

export default function useColorScheme(): NonNullable<ColorSchemeName> {
  // Always return the light theme.
  return "light";
}
