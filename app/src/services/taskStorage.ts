import AsyncStorage from '@react-native-async-storage/async-storage';

import type { Task, TaskInput } from '../types/task';

const STORAGE_KEY = '@tarefafacil:tasks';

export class TaskStorageError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TaskStorageError';
  }
}

export function describeError(error: unknown): string {
  return error instanceof TaskStorageError
    ? error.message
    : 'Ocorreu um erro inesperado. Tente novamente.';
}

function isIsoDate(value: unknown): value is string {
  return typeof value === 'string' && !Number.isNaN(Date.parse(value));
}

function isTask(value: unknown): value is Task {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const task = value as Record<string, unknown>;
  return (
    typeof task.id === 'string' &&
    typeof task.title === 'string' &&
    (task.description === undefined || typeof task.description === 'string') &&
    isIsoDate(task.dueDate) &&
    typeof task.completed === 'boolean' &&
    isIsoDate(task.createdAt) &&
    isIsoDate(task.updatedAt)
  );
}

async function readTasks(): Promise<Task[]> {
  let raw: string | null;
  try {
    raw = await AsyncStorage.getItem(STORAGE_KEY);
  } catch {
    throw new TaskStorageError('Não foi possível ler as tarefas salvas.');
  }
  if (raw === null) {
    return [];
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new TaskStorageError('Os dados salvos estão corrompidos e não puderam ser lidos.');
  }
  // Dados inconsistentes geram erro, em vez de serem descartados e sobrescritos.
  if (!Array.isArray(parsed) || !parsed.every(isTask)) {
    throw new TaskStorageError('Os dados salvos estão em formato inválido.');
  }
  return parsed;
}

async function writeTasks(tasks: Task[]): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch {
    throw new TaskStorageError('Não foi possível salvar as alterações.');
  }
}

// Serializa as operações de leitura-modificação-gravação para evitar perda de dados.
let queue: Promise<unknown> = Promise.resolve();

function enqueue<T>(operation: () => Promise<T>): Promise<T> {
  const result = queue.then(operation);
  queue = result.catch(() => undefined);
  return result;
}

function generateId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function requireIndex(tasks: Task[], id: string): number {
  const index = tasks.findIndex((task) => task.id === id);
  if (index === -1) {
    throw new TaskStorageError('Tarefa não encontrada. Ela pode ter sido excluída.');
  }
  return index;
}

export function loadTasks(): Promise<Task[]> {
  return enqueue(readTasks);
}

/** Remove todas as tarefas salvas. */
export function clearTasks(): Promise<void> {
  return enqueue(async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch {
      throw new TaskStorageError('Não foi possível excluir as tarefas.');
    }
  });
}

export function getTask(id: string): Promise<Task> {
  return enqueue(async () => {
    const tasks = await readTasks();
    return tasks[requireIndex(tasks, id)];
  });
}

export function createTask(input: TaskInput): Promise<Task> {
  return enqueue(async () => {
    const tasks = await readTasks();
    const now = new Date().toISOString();
    const task: Task = {
      id: generateId(),
      title: input.title,
      description: input.description,
      dueDate: input.dueDate,
      completed: false,
      createdAt: now,
      updatedAt: now,
    };
    await writeTasks([...tasks, task]);
    return task;
  });
}

export function updateTask(id: string, input: TaskInput): Promise<Task> {
  return enqueue(async () => {
    const tasks = await readTasks();
    const index = requireIndex(tasks, id);
    const updated: Task = {
      ...tasks[index],
      title: input.title,
      description: input.description,
      dueDate: input.dueDate,
      updatedAt: new Date().toISOString(),
    };
    await writeTasks(tasks.map((task, i) => (i === index ? updated : task)));
    return updated;
  });
}

export function completeTask(id: string): Promise<Task> {
  return enqueue(async () => {
    const tasks = await readTasks();
    const index = requireIndex(tasks, id);
    const completed: Task = {
      ...tasks[index],
      completed: true,
      updatedAt: new Date().toISOString(),
    };
    await writeTasks(tasks.map((task, i) => (i === index ? completed : task)));
    return completed;
  });
}

export function deleteTask(id: string): Promise<void> {
  return enqueue(async () => {
    const tasks = await readTasks();
    const index = requireIndex(tasks, id);
    await writeTasks(tasks.filter((_, i) => i !== index));
  });
}
