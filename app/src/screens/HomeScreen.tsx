import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { FAB, Surface, Text, TouchableRipple, useTheme } from 'react-native-paper';

import TaskList from '../components/TaskList';
import { useTasks } from '../hooks/useTasks';
import type { RootStackParamList } from '../navigation/types';
import { countTasks, filterTasks, type TaskFilter } from '../utils/taskStatus';

const FILTERS: { key: TaskFilter; label: string }[] = [
  { key: 'all', label: 'Todas' },
  { key: 'pending', label: 'Pendentes' },
  { key: 'overdue', label: 'Vencidas' },
];

const EMPTY_MESSAGES: Record<TaskFilter, string> = {
  all: 'Nenhuma tarefa cadastrada. Toque em + para criar a primeira.',
  pending: 'Nenhuma tarefa pendente.',
  overdue: 'Nenhuma tarefa vencida.',
};

export default function HomeScreen() {
  const theme = useTheme();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { tasks, now, loading, error, reload, complete, remove } = useTasks();
  const [filter, setFilter] = useState<TaskFilter>('all');

  const counts = countTasks(tasks, now);

  const indicators = (
    <View style={styles.indicators}>
      {FILTERS.map(({ key, label }) => {
        const selected = filter === key;
        return (
          <Surface
            key={key}
            mode="flat"
            style={[
              styles.indicator,
              {
                backgroundColor: selected
                  ? theme.colors.primaryContainer
                  : theme.colors.surfaceVariant,
                borderColor: selected ? theme.colors.primary : 'transparent',
              },
            ]}
          >
            <TouchableRipple
              accessibilityRole="button"
              accessibilityLabel={`${label}: ${counts[key]}`}
              accessibilityState={{ selected }}
              onPress={() => setFilter(key)}
              style={styles.indicatorTouch}
            >
              <View style={styles.indicatorContent}>
                <Text variant="headlineSmall">{counts[key]}</Text>
                <Text variant="labelMedium">{label}</Text>
              </View>
            </TouchableRipple>
          </Surface>
        );
      })}
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <TaskList
        tasks={filterTasks(tasks, filter, now)}
        now={now}
        loading={loading}
        error={error}
        emptyMessage={EMPTY_MESSAGES[filter]}
        header={indicators}
        onComplete={complete}
        onDelete={remove}
        onRetry={reload}
      />
      <FAB
        icon="plus"
        accessibilityLabel="Nova tarefa"
        style={styles.fab}
        onPress={() => navigation.navigate('TaskForm')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  indicators: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  indicator: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 2,
    overflow: 'hidden',
  },
  indicatorTouch: {
    paddingVertical: 12,
  },
  indicatorContent: {
    alignItems: 'center',
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
  },
});
