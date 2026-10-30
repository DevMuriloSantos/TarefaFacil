import AsyncStorage from '@react-native-async-storage/async-storage';

import { BORDER_COLOR_OPTIONS, type Profile, type ProfileInput } from '../types/profile';
import { clearPhotos, deletePhoto, storePhoto } from './photoStorage';
import { clearTasks, TaskStorageError } from './taskStorage';
import { clearThemeMode } from './themeStorage';

const STORAGE_KEY = '@tarefafacil:profile';

export class ProfileStorageError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ProfileStorageError';
  }
}

export function describeStorageError(error: unknown): string {
  return error instanceof ProfileStorageError || error instanceof TaskStorageError
    ? error.message
    : 'Ocorreu um erro inesperado. Tente novamente.';
}

function isProfile(value: unknown): value is Profile {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const profile = value as Record<string, unknown>;
  return (
    typeof profile.name === 'string' &&
    typeof profile.email === 'string' &&
    (profile.photoUri === undefined || typeof profile.photoUri === 'string') &&
    typeof profile.createdAt === 'string' &&
    !Number.isNaN(Date.parse(profile.createdAt)) &&
    BORDER_COLOR_OPTIONS.some((option) => option.key === profile.borderColor)
  );
}

export async function loadProfile(): Promise<Profile | null> {
  let raw: string | null;
  try {
    raw = await AsyncStorage.getItem(STORAGE_KEY);
  } catch {
    throw new ProfileStorageError('Não foi possível ler o perfil salvo.');
  }
  if (raw === null) {
    return null;
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new ProfileStorageError('Os dados do perfil estão corrompidos e não puderam ser lidos.');
  }
  if (!isProfile(parsed)) {
    throw new ProfileStorageError('Os dados do perfil estão em formato inválido.');
  }
  return parsed;
}

/**
 * Cria o perfil (`current` nulo) ou atualiza o existente, preservando `createdAt`.
 * Uma foto nova é copiada para o armazenamento do aplicativo; a anterior é removida
 * só depois que o perfil foi gravado, e a cópia nova é descartada se a gravação falhar.
 */
export async function saveProfile(
  input: ProfileInput,
  current: Profile | null,
): Promise<Profile> {
  const photoChanged = input.photoUri !== current?.photoUri;

  let photoUri = current?.photoUri;
  if (photoChanged) {
    photoUri = undefined;
    if (input.photoUri) {
      try {
        photoUri = await storePhoto(input.photoUri);
      } catch {
        throw new ProfileStorageError('Não foi possível salvar a foto escolhida.');
      }
    }
  }

  const profile: Profile = {
    name: input.name,
    email: input.email,
    photoUri,
    borderColor: input.borderColor,
    createdAt: current?.createdAt ?? new Date().toISOString(),
  };

  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch {
    if (photoChanged && photoUri) {
      deletePhoto(photoUri);
    }
    throw new ProfileStorageError('Não foi possível salvar o perfil.');
  }

  if (photoChanged && current?.photoUri) {
    deletePhoto(current.photoUri);
  }
  return profile;
}

/** Exclui somente o perfil e a foto armazenada. Tarefas e tema são preservados. */
export async function deleteUserData(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch {
    throw new ProfileStorageError('Não foi possível excluir os dados do usuário.');
  }
  clearPhotos();
}

/**
 * Exclui perfil, foto, tarefas e a preferência de tema, cada um pela sua chave.
 * O perfil é removido por último, para que uma falha possa ser repetida.
 */
export async function deleteAccount(): Promise<void> {
  await clearTasks();
  try {
    await clearThemeMode();
  } catch {
    throw new ProfileStorageError('Não foi possível restaurar o tema padrão.');
  }
  await deleteUserData();
}
