import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  Button,
  HelperText,
  Text,
  TextInput,
  TouchableRipple,
  useTheme,
} from 'react-native-paper';

import { describeStorageError } from '../services/profileStorage';
import {
  BORDER_COLOR_OPTIONS,
  DEFAULT_BORDER_COLOR,
  getBorderColor,
  type BorderColorKey,
  type Profile,
  type ProfileInput,
} from '../types/profile';
import ProfileAvatar from './ProfileAvatar';

// Limites de entrada da interface.
const NAME_MAX_LENGTH = 60;
const EMAIL_MAX_LENGTH = 100;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface FormErrors {
  name?: string;
  email?: string;
}

interface ProfileFormProps {
  /** Perfil a editar; nulo na criação. */
  initial: Profile | null;
  submitLabel: string;
  onSubmit: (input: ProfileInput) => Promise<void>;
  onCancel?: () => void;
}

export default function ProfileForm({
  initial,
  submitLabel,
  onSubmit,
  onCancel,
}: ProfileFormProps) {
  const theme = useTheme();
  const [name, setName] = useState(initial?.name ?? '');
  const [email, setEmail] = useState(initial?.email ?? '');
  const [photoUri, setPhotoUri] = useState<string | undefined>(initial?.photoUri);
  const [borderColor, setBorderColor] = useState<BorderColorKey>(
    initial?.borderColor ?? DEFAULT_BORDER_COLOR,
  );
  const [errors, setErrors] = useState<FormErrors>({});
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handlePickResult = (result: ImagePicker.ImagePickerResult) => {
    if (!result.canceled && result.assets.length > 0) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  const pickFromGallery = async () => {
    setPhotoError(null);
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        setPhotoError(
          permission.canAskAgain
            ? 'Sem permissão para acessar a galeria. Conceda o acesso para escolher uma foto.'
            : 'O acesso à galeria está bloqueado. Habilite-o nas configurações do aparelho.',
        );
        return;
      }
      handlePickResult(
        await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ['images'],
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        }),
      );
    } catch {
      setPhotoError('Não foi possível abrir a galeria.');
    }
  };

  const validate = (): FormErrors => {
    const result: FormErrors = {};
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (trimmedName.length === 0) {
      result.name = 'Informe o nome.';
    } else if (trimmedName.length > NAME_MAX_LENGTH) {
      result.name = `O nome deve ter no máximo ${NAME_MAX_LENGTH} caracteres.`;
    }

    if (trimmedEmail.length === 0) {
      result.email = 'Informe o e-mail.';
    } else if (trimmedEmail.length > EMAIL_MAX_LENGTH) {
      result.email = `O e-mail deve ter no máximo ${EMAIL_MAX_LENGTH} caracteres.`;
    } else if (!EMAIL_PATTERN.test(trimmedEmail)) {
      result.email = 'Informe um e-mail válido, como nome@exemplo.com.';
    }
    return result;
  };

  const handleSubmit = async () => {
    const found = validate();
    setErrors(found);
    setSubmitError(null);
    if (Object.keys(found).length > 0) {
      return;
    }

    setSaving(true);
    try {
      await onSubmit({ name: name.trim(), email: email.trim(), photoUri, borderColor });
    } catch (e) {
      setSubmitError(describeStorageError(e));
    } finally {
      setSaving(false);
    }
  };

  return (
    <View>
      <View style={styles.avatar}>
        <ProfileAvatar size={120} photoUri={photoUri} borderColor={getBorderColor(borderColor)} />
      </View>

      <View style={styles.photoButtons}>
        <Button mode="outlined" icon="image-outline" onPress={pickFromGallery} disabled={saving}>
          Galeria
        </Button>
      </View>
      <HelperText type="error" visible={photoError !== null}>
        {photoError}
      </HelperText>

      <Text variant="labelLarge" style={styles.colorLabel}>
        Cor da borda
      </Text>
      <View style={styles.colors}>
        {BORDER_COLOR_OPTIONS.map((option) => {
          const selected = option.key === borderColor;
          return (
            <TouchableRipple
              key={option.key}
              accessibilityRole="radio"
              accessibilityLabel={option.label}
              accessibilityState={{ selected }}
              onPress={() => setBorderColor(option.key)}
              style={[
                styles.colorOption,
                { borderColor: selected ? theme.colors.primary : theme.colors.outlineVariant },
              ]}
            >
              <View style={styles.colorContent}>
                <View style={[styles.swatch, { backgroundColor: option.color }]}>
                  {selected ? (
                    <MaterialCommunityIcons name="check" size={20} color="#FFFFFF" />
                  ) : null}
                </View>
                <Text variant="labelMedium">{option.label}</Text>
              </View>
            </TouchableRipple>
          );
        })}
      </View>

      <TextInput
        mode="outlined"
        label="Nome"
        value={name}
        maxLength={NAME_MAX_LENGTH}
        autoCapitalize="words"
        error={errors.name !== undefined}
        onChangeText={(value) => {
          setName(value);
          setErrors((prev) => ({ ...prev, name: undefined }));
        }}
      />
      <HelperText type="error" visible={errors.name !== undefined}>
        {errors.name}
      </HelperText>

      <TextInput
        mode="outlined"
        label="E-mail"
        value={email}
        maxLength={EMAIL_MAX_LENGTH}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        error={errors.email !== undefined}
        onChangeText={(value) => {
          setEmail(value);
          setErrors((prev) => ({ ...prev, email: undefined }));
        }}
      />
      <HelperText type="error" visible={errors.email !== undefined}>
        {errors.email}
      </HelperText>

      {submitError ? (
        <HelperText type="error" visible>
          {submitError}
        </HelperText>
      ) : null}

      <Button
        mode="contained"
        style={styles.submit}
        loading={saving}
        disabled={saving}
        onPress={handleSubmit}
      >
        {submitLabel}
      </Button>
      {onCancel ? (
        <Button style={styles.cancel} disabled={saving} onPress={onCancel}>
          Cancelar
        </Button>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    alignItems: 'center',
    marginBottom: 16,
  },
  photoButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  colorLabel: {
    marginTop: 8,
    marginBottom: 8,
  },
  colors: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  colorOption: {
    flex: 1,
    borderWidth: 2,
    borderRadius: 12,
    paddingVertical: 12,
  },
  colorContent: {
    alignItems: 'center',
    gap: 6,
  },
  swatch: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submit: {
    marginTop: 8,
  },
  cancel: {
    marginTop: 8,
  },
});
