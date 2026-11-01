import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { PaperProvider } from 'react-native-paper';

import { ProfileProvider } from './src/context/ProfileContext';
import { ThemeProvider, useThemeMode } from './src/context/ThemeContext';
import AppNavigator from './src/navigation/AppNavigator';
import { themes } from './src/theme';

function ThemedApp() {
  const { themeMode, loading, resetThemeMode } = useThemeMode();
  const { paper, navigation } = themes[themeMode];

  // Evita mostrar o tema claro e trocar para o escuro depois que o app já está em uso.
  if (loading) {
    return (
      <View style={[styles.loading, { backgroundColor: paper.colors.background }]}>
        <ActivityIndicator accessibilityLabel="Carregando" />
      </View>
    );
  }

  // A exclusão da conta apaga a preferência salva e restaura o tema padrão.
  return (
    <PaperProvider theme={paper}>
      <ProfileProvider onAccountDeleted={resetThemeMode}>
        <NavigationContainer theme={navigation}>
          <AppNavigator />
          <StatusBar style={themeMode === 'dark' ? 'light' : 'dark'} />
        </NavigationContainer>
      </ProfileProvider>
    </PaperProvider>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <ThemedApp />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
