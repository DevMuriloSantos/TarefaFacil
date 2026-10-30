import AsyncStorage from '@react-native-async-storage/async-storage';

import { defaultThemeMode, type ThemeMode } from '../theme';

const STORAGE_KEY = '@tarefafacil:theme';

/** Lê a preferência de tema salva; em caso de ausência ou erro, usa o tema padrão. */
export async function loadThemeMode(): Promise<ThemeMode> {
  try {
    const value = await AsyncStorage.getItem(STORAGE_KEY);
    return value === 'light' || value === 'dark' ? value : defaultThemeMode;
  } catch {
    return defaultThemeMode;
  }
}

export function clearThemeMode(): Promise<void> {
  return AsyncStorage.removeItem(STORAGE_KEY);
}
