import { StyleSheet, View } from 'react-native';
import { Card, IconButton, Text, useTheme } from 'react-native-paper';

import type { Task } from '../types/task';
import { formatDate, formatTime } from '../utils/date';
import { getTaskStatus, type TaskStatus } from '../utils/taskStatus';

interface TaskItemProps {
  task: Task;
  now: Date;
  onEdit: (task: Task) => void;
  /** Quando omitido, a ação de concluir não é exibida. */
  onComplete?: (task: Task) => void;
  onDelete: (task: Task) => void;
}

const STATUS_LABELS: Record<TaskStatus, string> = {
  pending: 'Pendente',
  overdue: 'Vencida',
  completed: 'Concluída',
};

export default function TaskItem({
  task,
  now,
  onEdit,
  onComplete,
  onDelete,
}: TaskItemProps) {
  const theme = useTheme();
  const status = getTaskStatus(task, now);
  const dueDate = new Date(task.dueDate);
  const statusColor =
    status === 'overdue'
      ? theme.colors.error
      : status === 'completed'
        ? theme.colors.primary
        : theme.colors.onSurfaceVariant;

  return (
    <Card mode="outlined" style={styles.card}>
      <Card.Content>
        <View style={styles.titleRow}>
          <Text
            variant="titleMedium"
            style={[styles.title, task.completed && styles.completedTitle]}
          >
            {task.title}
          </Text>
          <Text variant="labelLarge" style={{ color: statusColor }}>
            {STATUS_LABELS[status]}
          </Text>
        </View>
        <Text variant="bodySmall" style={{ color: statusColor }}>
          {formatDate(dueDate)} às {formatTime(dueDate)}
        </Text>
        {task.description ? (
          <Text variant="bodyMedium" style={styles.description}>
            {task.description}
          </Text>
        ) : null}
      </Card.Content>
      <Card.Actions>
        <IconButton
          icon="pencil-outline"
          accessibilityLabel={`Editar tarefa ${task.title}`}
          onPress={() => onEdit(task)}
        />
        {onComplete && !task.completed ? (
          <IconButton
            icon="check"
            accessibilityLabel={`Concluir tarefa ${task.title}`}
            onPress={() => onComplete(task)}
          />
        ) : null}
        <IconButton
          icon="trash-can-outline"
          iconColor={theme.colors.error}
          accessibilityLabel={`Excluir tarefa ${task.title}`}
          onPress={() => onDelete(task)}
        />
      </Card.Actions>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  title: {
    flex: 1,
  },
  completedTitle: {
    textDecorationLine: 'line-through',
  },
  description: {
    marginTop: 8,
  },
});
