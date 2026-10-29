import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useState, type ReactNode } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import {
  ActivityIndicator,
  Button,
  Dialog,
  Portal,
  Text,
  useTheme,
} from 'react-native-paper';

import type { RootStackParamList } from '../navigation/types';
import type { Task } from '../types/task';
import TaskItem from './TaskItem';

interface TaskListProps {
  tasks: Task[];
  now: Date;
  loading: boolean;
  error: string | null;
  emptyMessage: string;
  header?: ReactNode;
  /** Quando omitido, a ação de concluir não é exibida. */
  onComplete?: (id: string) => void;
  onDelete: (id: string) => void;
  onRetry: () => void;
}

export default function TaskList({
  tasks,
  now,
  loading,
  error,
  emptyMessage,
  header,
  onComplete,
  onDelete,
  onRetry,
}: TaskListProps) {
  const theme = useTheme();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator accessibilityLabel="Carregando tarefas" />
      </View>
    );
  }

  const confirmDelete = () => {
    if (taskToDelete) {
      onDelete(taskToDelete.id);
    }
    setTaskToDelete(null);
  };

  return (
    <>
      <FlatList
        data={tasks}
        extraData={now}
        keyExtractor={(task) => task.id}
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <View>
            {header}
            {error ? (
              <View style={styles.error}>
                <Text style={{ color: theme.colors.error }}>{error}</Text>
                <Button onPress={onRetry}>Tentar novamente</Button>
              </View>
            ) : null}
          </View>
        }
        ListEmptyComponent={
          error ? undefined : (
            <Text variant="bodyLarge" style={styles.empty}>
              {emptyMessage}
            </Text>
          )
        }
        renderItem={({ item }) => (
          <TaskItem
            task={item}
            now={now}
            onEdit={(task) => navigation.navigate('TaskForm', { taskId: task.id })}
            onComplete={onComplete ? (task) => onComplete(task.id) : undefined}
            onDelete={setTaskToDelete}
          />
        )}
      />
      <Portal>
        <Dialog visible={taskToDelete !== null} onDismiss={() => setTaskToDelete(null)}>
          <Dialog.Title>Excluir tarefa</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              Deseja excluir a tarefa "{taskToDelete?.title}"? Esta ação não pode ser desfeita.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setTaskToDelete(null)}>Cancelar</Button>
            <Button textColor={theme.colors.error} onPress={confirmDelete}>
              Excluir
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Espaço inferior para o botão flutuante não cobrir o último item.
  content: {
    padding: 16,
    paddingBottom: 96,
  },
  error: {
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  empty: {
    textAlign: 'center',
    marginTop: 32,
  },
});
