import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useState } from 'react';
import { PaperProvider } from 'react-native-paper';

import { ProfileProvider } from './src/context/ProfileContext';
import AppNavigator from './src/navigation/AppNavigator';
import { loadThemeMode } from './src/services/themeStorage';
import { defaultThemeMode, themes, type ThemeMode } from './src/theme';

export default function App() {
  const [themeMode, setThemeMode] = useState<ThemeMode>(defaultThemeMode);
  const { paper, navigation } = themes[themeMode];

  useEffect(() => {
    void loadThemeMode().then(setThemeMode);
  }, []);

  // A exclusão da conta apaga a preferência salva e restaura o tema padrão.
  const handleAccountDeleted = useCallback(() => setThemeMode(defaultThemeMode), []);

  return (
    <PaperProvider theme={paper}>
      <ProfileProvider onAccountDeleted={handleAccountDeleted}>
        <NavigationContainer theme={navigation}>
          <AppNavigator />
          <StatusBar style={themeMode === 'dark' ? 'light' : 'dark'} />
        </NavigationContainer>
      </ProfileProvider>
    </PaperProvider>
  );
}
