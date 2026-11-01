import { useState } from 'react';
import { Linking, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Divider, HelperText, Switch, Text, useTheme } from 'react-native-paper';

import appConfig from '../../app.json';
import { useThemeMode } from '../context/ThemeContext';

const APP_NAME = 'TarefaFacil';
const APP_VERSION = appConfig.expo.version;
const DEVELOPERS = 'Murilo Santos e Matheus Barros';
const REPOSITORY_URL = 'https://github.com/DevMuriloSantos/TarefaFacil';

function CreditRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.creditRow}>
      <Text variant="labelLarge">{label}</Text>
      <Text variant="bodyLarge">{value}</Text>
    </View>
  );
}

export default function SettingsScreen() {
  const theme = useTheme();
  const { themeMode, setThemeMode } = useThemeMode();
  const [saveError, setSaveError] = useState<string | null>(null);
  const [linkError, setLinkError] = useState<string | null>(null);
  const isDark = themeMode === 'dark';

  const handleToggle = async (value: boolean) => {
    setSaveError(null);
    try {
      await setThemeMode(value ? 'dark' : 'light');
    } catch {
      setSaveError('Não foi possível salvar a preferência. O tema só vale até fechar o aplicativo.');
    }
  };

  const openRepository = async () => {
    setLinkError(null);
    try {
      await Linking.openURL(REPOSITORY_URL);
    } catch {
      setLinkError('Não foi possível abrir o repositório. Acesse: ' + REPOSITORY_URL);
    }
  };

  return (
    <ScrollView
      style={{ backgroundColor: theme.colors.background }}
      contentContainerStyle={styles.content}
    >
      <Text variant="titleMedium" style={styles.section}>
        Aparência
      </Text>
      <View style={styles.row}>
        <Text variant="bodyLarge" style={styles.label}>
          {isDark ? 'Tema escuro' : 'Tema claro'}
        </Text>
        <Switch
          value={isDark}
          onValueChange={handleToggle}
          accessibilityLabel="Tema escuro"
        />
      </View>
      <HelperText type="error" visible={saveError !== null}>
        {saveError}
      </HelperText>

      <Divider style={styles.divider} />

      <Text variant="titleMedium" style={styles.section}>
        Créditos
      </Text>
      <CreditRow label="Aplicativo" value={APP_NAME} />
      <CreditRow label="Versão" value={APP_VERSION} />
      <CreditRow label="Desenvolvedores" value={DEVELOPERS} />
      <Button
        mode="outlined"
        icon="github"
        style={styles.repository}
        onPress={openRepository}
      >
        Ver repositório no GitHub
      </Button>
      <HelperText type="error" visible={linkError !== null}>
        {linkError}
      </HelperText>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 16,
  },
  section: {
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    flex: 1,
  },
  divider: {
    marginVertical: 16,
  },
  creditRow: {
    marginBottom: 12,
  },
  repository: {
    marginTop: 4,
  },
});
