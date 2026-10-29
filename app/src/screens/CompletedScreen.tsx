import { StyleSheet, View } from 'react-native';
import { Card, Text, useTheme } from 'react-native-paper';

import TaskList from '../components/TaskList';
import { useTasks } from '../hooks/useTasks';

export default function CompletedScreen() {
  const theme = useTheme();
  const { tasks, now, loading, error, reload, remove } = useTasks();
  const completedTasks = tasks.filter((task) => task.completed);

  const total = (
    <Card mode="contained" style={styles.total}>
      <Card.Content style={styles.totalContent}>
        <Text variant="headlineSmall">{completedTasks.length}</Text>
        <Text variant="labelLarge">Concluídas</Text>
      </Card.Content>
    </Card>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <TaskList
        tasks={completedTasks}
        now={now}
        loading={loading}
        error={error}
        emptyMessage="Nenhuma tarefa concluída ainda."
        header={total}
        onDelete={remove}
        onRetry={reload}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  total: {
    marginBottom: 16,
  },
  totalContent: {
    alignItems: 'center',
  },
});
