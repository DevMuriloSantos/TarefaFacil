import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import {
  deleteAccount as removeAccount,
  deleteUserData as removeUserData,
  describeStorageError,
  loadProfile,
  saveProfile,
} from '../services/profileStorage';
import type { Profile, ProfileInput } from '../types/profile';

interface ProfileContextValue {
  profile: Profile | null;
  loading: boolean;
  /** Falha ao ler o perfil salvo. Enquanto existir, o perfil não deve ser recriado. */
  error: string | null;
  reload: () => Promise<void>;
  save: (input: ProfileInput) => Promise<void>;
  deleteUserData: () => Promise<void>;
  deleteAccount: () => Promise<void>;
}

const ProfileContext = createContext<ProfileContextValue | null>(null);

interface ProfileProviderProps {
  children: ReactNode;
  /** Chamado após a exclusão da conta, para restaurar o tema padrão. */
  onAccountDeleted: () => void;
}

// O perfil é compartilhado pela tela Perfil e pelo avatar do cabeçalho.
export function ProfileProvider({ children, onAccountDeleted }: ProfileProviderProps) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    try {
      setProfile(await loadProfile());
      setError(null);
    } catch (e) {
      setError(describeStorageError(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  const save = useCallback(
    async (input: ProfileInput) => {
      setProfile(await saveProfile(input, profile));
    },
    [profile],
  );

  const deleteUserData = useCallback(async () => {
    try {
      await removeUserData();
    } finally {
      await reload();
    }
  }, [reload]);

  const deleteAccount = useCallback(async () => {
    try {
      await removeAccount();
    } finally {
      await reload();
    }
    onAccountDeleted();
  }, [reload, onAccountDeleted]);

  const value = useMemo(
    () => ({ profile, loading, error, reload, save, deleteUserData, deleteAccount }),
    [profile, loading, error, reload, save, deleteUserData, deleteAccount],
  );

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export function useProfile(): ProfileContextValue {
  const value = useContext(ProfileContext);
  if (value === null) {
    throw new Error('useProfile deve ser usado dentro de ProfileProvider.');
  }
  return value;
}
