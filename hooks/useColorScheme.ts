import {ColorSchemeName, useColorScheme as _useColorScheme} from 'react-native';

// The useColorScheme value is always either light or dark, but the built-in
// type suggests that it can be null. This will not happen in practice, so this
// makes it a bit easier to work with.
export default function useColorScheme(): NonNullable<ColorSchemeName> {
  // TODO: allow user to override system scheme. However, the implementation involves refactoring all usages of `useColorScheme`.
  // And since the theme is stored in `AsyncStorage`, there might be a brief blip of changing themes
  // (although this could be solved by not showing the app until then)
  // Regardless, I would need to move color theme into global state, and if I'm doing that, I could have `useColorScheme`
  // Get the state from context, and then write a different hook that can set it
  // Too much work for little usage imo, won't implement now
  return _useColorScheme() as NonNullable<ColorSchemeName>;
}
