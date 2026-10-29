export interface Task {
  id: string;
  title: string;
  description?: string;
  /** Data e horário de vencimento, em ISO 8601. */
  dueDate: string;
  completed: boolean;
  /** ISO 8601. */
  createdAt: string;
  /** ISO 8601. */
  updatedAt: string;
}

/** Campos editáveis pelo usuário no formulário. */
export interface TaskInput {
  title: string;
  description?: string;
  dueDate: string;
}
