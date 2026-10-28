import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

interface PlaceholderScreenProps {
  title: string;
  description: string;
  children?: ReactNode;
}

export default function PlaceholderScreen({
  title,
  description,
  children,
}: PlaceholderScreenProps) {
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text variant="headlineSmall">{title}</Text>
      <Text variant="bodyMedium" style={styles.description}>
        {description}
      </Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  description: {
    marginTop: 8,
    textAlign: 'center',
  },
});
