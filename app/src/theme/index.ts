import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
  type Theme as NavigationTheme,
} from '@react-navigation/native';
import {
  adaptNavigationTheme,
  MD3DarkTheme,
  MD3LightTheme,
  type MD3Theme,
} from 'react-native-paper';

export type ThemeMode = 'light' | 'dark';

export interface AppTheme {
  paper: MD3Theme;
  navigation: NavigationTheme;
}

// Alinha as cores do React Navigation às do Paper, partindo dos temas padrão.
const { LightTheme, DarkTheme } = adaptNavigationTheme({
  reactNavigationLight: NavigationDefaultTheme,
  reactNavigationDark: NavigationDarkTheme,
  materialLight: MD3LightTheme,
  materialDark: MD3DarkTheme,
});

export const themes: Record<ThemeMode, AppTheme> = {
  light: { paper: MD3LightTheme, navigation: LightTheme },
  dark: { paper: MD3DarkTheme, navigation: DarkTheme },
};

export const defaultThemeMode: ThemeMode = 'light';
