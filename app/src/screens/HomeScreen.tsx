import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StyleSheet } from 'react-native';
import { FAB } from 'react-native-paper';

import PlaceholderScreen from '../components/PlaceholderScreen';
import type { RootStackParamList } from '../navigation/types';

export default function HomeScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <PlaceholderScreen
      title="Principal"
      description="Aqui ficarão os indicadores e a lista de tarefas."
    >
      <FAB
        icon="plus"
        accessibilityLabel="Nova tarefa"
        style={styles.fab}
        onPress={() => navigation.navigate('TaskForm')}
      />
    </PlaceholderScreen>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
  },
});
