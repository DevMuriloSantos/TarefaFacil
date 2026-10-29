import type { Task } from '../types/task';

export type TaskStatus = 'pending' | 'overdue' | 'completed';
export type TaskFilter = 'all' | 'pending' | 'overdue';

export interface TaskCounts {
  all: number;
  pending: number;
  overdue: number;
  completed: number;
}

export function getTaskStatus(task: Task, now: Date): TaskStatus {
  if (task.completed) {
    return 'completed';
  }
  return new Date(task.dueDate).getTime() <= now.getTime() ? 'overdue' : 'pending';
}

export function countTasks(tasks: Task[], now: Date): TaskCounts {
  const counts: TaskCounts = { all: tasks.length, pending: 0, overdue: 0, completed: 0 };
  for (const task of tasks) {
    counts[getTaskStatus(task, now)] += 1;
  }
  return counts;
}

export function filterTasks(tasks: Task[], filter: TaskFilter, now: Date): Task[] {
  if (filter === 'all') {
    return tasks;
  }
  return tasks.filter((task) => getTaskStatus(task, now) === filter);
}
