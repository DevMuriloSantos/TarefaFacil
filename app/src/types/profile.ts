export type BorderColorKey = 'blue' | 'lightGreen';

export interface BorderColorOption {
  key: BorderColorKey;
  label: string;
  color: string;
}

// Únicas cores de borda aprovadas para a foto de perfil.
export const BORDER_COLOR_OPTIONS: readonly BorderColorOption[] = [
  { key: 'blue', label: 'Azul', color: '#1E88E5' },
  { key: 'lightGreen', label: 'Verde-claro', color: '#8BC34A' },
];

export const DEFAULT_BORDER_COLOR: BorderColorKey = 'blue';

export function getBorderColor(key: BorderColorKey): string {
  const option = BORDER_COLOR_OPTIONS.find((item) => item.key === key);
  return (option ?? BORDER_COLOR_OPTIONS[0]).color;
}

export interface Profile {
  name: string;
  email: string;
  /** URI de um arquivo copiado para o armazenamento do aplicativo. */
  photoUri?: string;
  /** ISO 8601. Definido na criação e nunca alterado. */
  createdAt: string;
  borderColor: BorderColorKey;
}

/** Campos editáveis pelo usuário. `photoUri` pode ser uma URI temporária do seletor. */
export interface ProfileInput {
  name: string;
  email: string;
  photoUri?: string;
  borderColor: BorderColorKey;
}
