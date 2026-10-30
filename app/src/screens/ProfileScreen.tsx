import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import {
  ActivityIndicator,
  Button,
  Dialog,
  HelperText,
  Portal,
  Text,
  useTheme,
} from 'react-native-paper';

import ProfileAvatar from '../components/ProfileAvatar';
import ProfileForm from '../components/ProfileForm';
import { useProfile } from '../context/ProfileContext';
import type { RootStackParamList } from '../navigation/types';
import { describeStorageError } from '../services/profileStorage';
import { getBorderColor } from '../types/profile';
import { formatDate } from '../utils/date';

type Props = NativeStackScreenProps<RootStackParamList, 'Profile'>;
type DeleteTarget = 'userData' | 'account';

const DELETE_DIALOGS: Record<DeleteTarget, { title: string; message: string; action: string }> = {
  userData: {
    title: 'Excluir dados do usuário',
    message:
      'Somente o perfil (nome, e-mail e foto) será excluído. Suas tarefas e o tema escolhido serão preservados. Esta ação não pode ser desfeita.',
    action: 'Excluir dados',
  },
  account: {
    title: 'Excluir conta',
    message:
      'O perfil, a foto e TODAS as tarefas serão excluídos, e o tema voltará ao padrão (claro). Esta ação não pode ser desfeita.',
    action: 'Excluir conta',
  },
};

export default function ProfileScreen({ navigation }: Props) {
  const theme = useTheme();
  const { profile, loading, error, reload, save, deleteUserData, deleteAccount } = useProfile();
  const [editing, setEditing] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const closeDialog = () => {
    if (!deleting) {
      setDeleteTarget(null);
    }
  };

  const confirmDelete = async () => {
    if (deleteTarget === null) {
      return;
    }
    setDeleting(true);
    setDeleteError(null);
    try {
      if (deleteTarget === 'userData') {
        await deleteUserData();
      } else {
        await deleteAccount();
        navigation.navigate('MainTabs', { screen: 'Home' });
      }
      setEditing(false);
    } catch (e) {
      setDeleteError(describeStorageError(e));
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  const containerStyle = { backgroundColor: theme.colors.background };

  if (loading) {
    return (
      <View style={[styles.centered, containerStyle]}>
        <ActivityIndicator accessibilityLabel="Carregando perfil" />
      </View>
    );
  }

  // Sem ler o perfil salvo, não oferecemos criar outro, para não sobrescrevê-lo.
  if (error) {
    return (
      <View style={[styles.centered, containerStyle]}>
        <Text style={[styles.errorText, { color: theme.colors.error }]}>{error}</Text>
        <Button onPress={reload}>Tentar novamente</Button>
      </View>
    );
  }

  if (profile === null) {
    return (
      <ScrollView
        style={containerStyle}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Text variant="titleMedium" style={styles.intro}>
          Crie seu perfil
        </Text>
        {deleteError ? (
          <HelperText type="error" visible>
            {deleteError}
          </HelperText>
        ) : null}
        <ProfileForm initial={null} submitLabel="Criar perfil" onSubmit={save} />
      </ScrollView>
    );
  }

  if (editing) {
    return (
      <ScrollView
        style={containerStyle}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <ProfileForm
          initial={profile}
          submitLabel="Salvar alterações"
          onSubmit={async (input) => {
            await save(input);
            setEditing(false);
          }}
          onCancel={() => setEditing(false)}
        />
      </ScrollView>
    );
  }

  const dialog = deleteTarget ? DELETE_DIALOGS[deleteTarget] : null;

  return (
    <ScrollView style={containerStyle} contentContainerStyle={styles.content}>
      <View style={styles.avatar}>
        <ProfileAvatar
          size={120}
          photoUri={profile.photoUri}
          borderColor={getBorderColor(profile.borderColor)}
        />
      </View>
      <Text variant="headlineSmall" style={styles.centerText}>
        {profile.name}
      </Text>
      <Text variant="bodyLarge" style={styles.centerText}>
        {profile.email}
      </Text>
      <Text variant="bodyMedium" style={[styles.centerText, styles.created]}>
        Perfil criado em {formatDate(new Date(profile.createdAt))}
      </Text>

      {deleteError ? (
        <HelperText type="error" visible>
          {deleteError}
        </HelperText>
      ) : null}

      <Button mode="contained" icon="pencil-outline" style={styles.action} onPress={() => setEditing(true)}>
        Editar perfil
      </Button>
      <Button
        mode="outlined"
        icon="account-remove-outline"
        style={styles.action}
        onPress={() => setDeleteTarget('userData')}
      >
        Excluir dados do usuário
      </Button>
      <Button
        mode="outlined"
        icon="delete-outline"
        textColor={theme.colors.error}
        style={styles.action}
        onPress={() => setDeleteTarget('account')}
      >
        Excluir conta
      </Button>

      <Portal>
        <Dialog visible={dialog !== null} onDismiss={closeDialog}>
          <Dialog.Title>{dialog?.title}</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">{dialog?.message}</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button disabled={deleting} onPress={closeDialog}>
              Cancelar
            </Button>
            <Button
              textColor={theme.colors.error}
              loading={deleting}
              disabled={deleting}
              onPress={confirmDelete}
            >
              {dialog?.action}
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  errorText: {
    textAlign: 'center',
  },
  content: {
    padding: 16,
  },
  intro: {
    textAlign: 'center',
    marginBottom: 16,
  },
  avatar: {
    alignItems: 'center',
    marginBottom: 16,
  },
  centerText: {
    textAlign: 'center',
  },
  created: {
    marginTop: 8,
    marginBottom: 16,
  },
  action: {
    marginTop: 12,
  },
});
