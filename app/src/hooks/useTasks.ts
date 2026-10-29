import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';

import {
  completeTask,
  deleteTask,
  describeError,
  loadTasks,
} from '../services/taskStorage';
import type { Task } from '../types/task';

const CLOCK_INTERVAL_MS = 30_000;

/**
 * Carrega as tarefas sempre que a tela recebe foco e mantém o horário atual
 * atualizado enquanto ela estiver ativa.
 */
export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [now, setNow] = useState(() => new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    try {
      setTasks(await loadTasks());
      setError(null);
    } catch (e) {
      setError(describeError(e));
    } finally {
      setNow(new Date());
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void reload();
      const timer = setInterval(() => setNow(new Date()), CLOCK_INTERVAL_MS);
      return () => clearInterval(timer);
    }, [reload]),
  );

  const runAction = useCallback(
    async (action: () => Promise<unknown>) => {
      let failure: string | null = null;
      try {
        await action();
      } catch (e) {
        failure = describeError(e);
      }
      await reload();
      if (failure !== null) {
        setError(failure);
      }
    },
    [reload],
  );

  const complete = useCallback((id: string) => runAction(() => completeTask(id)), [runAction]);
  const remove = useCallback((id: string) => runAction(() => deleteTask(id)), [runAction]);

  return { tasks, now, loading, error, reload, complete, remove };
}
