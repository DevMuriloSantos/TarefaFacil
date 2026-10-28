import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { PaperProvider } from 'react-native-paper';

import AppNavigator from './src/navigation/AppNavigator';
import { defaultThemeMode, themes } from './src/theme';

export default function App() {
  // O modo será lido da preferência persistida em etapa futura.
  const { paper, navigation } = themes[defaultThemeMode];

  return (
    <PaperProvider theme={paper}>
      <NavigationContainer theme={navigation}>
        <AppNavigator />
        <StatusBar style={defaultThemeMode === 'dark' ? 'light' : 'dark'} />
      </NavigationContainer>
    </PaperProvider>
  );
}
