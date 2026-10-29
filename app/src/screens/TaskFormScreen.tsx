import DateTimePicker, {
  DateTimePickerAndroid,
} from '@react-native-community/datetimepicker';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { Platform, ScrollView, StyleSheet, View } from 'react-native';
import {
  ActivityIndicator,
  Button,
  HelperText,
  Text,
  TextInput,
  useTheme,
} from 'react-native-paper';

import type { RootStackParamList } from '../navigation/types';
import { createTask, describeError, getTask, updateTask } from '../services/taskStorage';
import { formatDate, formatTime } from '../utils/date';

type Props = NativeStackScreenProps<RootStackParamList, 'TaskForm'>;
type PickerMode = 'date' | 'time';

const TITLE_MAX_LENGTH = 100;
const DESCRIPTION_MAX_LENGTH = 500;

interface FormErrors {
  title?: string;
  date?: string;
  time?: string;
}

export default function TaskFormScreen({ navigation, route }: Props) {
  const theme = useTheme();
  const taskId = route.params?.taskId;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState<Date | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(taskId !== undefined);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [iosPicker, setIosPicker] = useState<PickerMode | null>(null);

  useEffect(() => {
    if (taskId === undefined) {
      return;
    }
    let active = true;
    getTask(taskId)
      .then((task) => {
        if (!active) return;
        const due = new Date(task.dueDate);
        setTitle(task.title);
        setDescription(task.description ?? '');
        setDate(due);
        setTime(due);
      })
      .catch((e: unknown) => {
        if (active) setLoadError(describeError(e));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [taskId]);

  const applyPicked = (mode: PickerMode, value: Date) => {
    if (mode === 'date') {
      setDate(value);
      setErrors((prev) => ({ ...prev, date: undefined }));
    } else {
      setTime(value);
      setErrors((prev) => ({ ...prev, time: undefined }));
    }
  };

  const openPicker = (mode: PickerMode) => {
    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        value: (mode === 'date' ? date : time) ?? new Date(),
        mode,
        is24Hour: true,
        onValueChange: (_event, value) => applyPicked(mode, value),
      });
    } else {
      setIosPicker(mode);
    }
  };

  const validate = (): FormErrors => {
    const result: FormErrors = {};
    const trimmedTitle = title.trim();
    if (trimmedTitle.length === 0) {
      result.title = 'Informe o título da tarefa.';
    } else if (trimmedTitle.length > TITLE_MAX_LENGTH) {
      result.title = `O título deve ter no máximo ${TITLE_MAX_LENGTH} caracteres.`;
    }
    if (date === null || Number.isNaN(date.getTime())) {
      result.date = 'Selecione a data de vencimento.';
    }
    if (time === null || Number.isNaN(time.getTime())) {
      result.time = 'Selecione o horário de vencimento.';
    }
    return result;
  };

  const handleSave = async () => {
    const found = validate();
    setErrors(found);
    setSaveError(null);
    if (Object.keys(found).length > 0 || date === null || time === null) {
      return;
    }
    if (description.trim().length > DESCRIPTION_MAX_LENGTH) {
      setSaveError(`A descrição deve ter no máximo ${DESCRIPTION_MAX_LENGTH} caracteres.`);
      return;
    }

    const input = {
      title: title.trim(),
      description: description.trim() || undefined,
      dueDate: new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        time.getHours(),
        time.getMinutes(),
        0,
        0,
      ).toISOString(),
    };

    setSaving(true);
    try {
      if (taskId === undefined) {
        await createTask(input);
      } else {
        await updateTask(taskId, input);
      }
      navigation.goBack();
    } catch (e) {
      setSaveError(describeError(e));
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator accessibilityLabel="Carregando tarefa" />
      </View>
    );
  }

  if (loadError) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.colors.background }]}>
        <Text style={{ color: theme.colors.error }}>{loadError}</Text>
        <Button onPress={navigation.goBack}>Voltar</Button>
      </View>
    );
  }

  return (
    <ScrollView
      style={{ backgroundColor: theme.colors.background }}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <TextInput
        mode="outlined"
        label="Título"
        value={title}
        maxLength={TITLE_MAX_LENGTH}
        error={errors.title !== undefined}
        onChangeText={(value) => {
          setTitle(value);
          setErrors((prev) => ({ ...prev, title: undefined }));
        }}
      />
      <HelperText type="error" visible={errors.title !== undefined}>
        {errors.title}
      </HelperText>

      <TextInput
        mode="outlined"
        label="Descrição (opcional)"
        value={description}
        maxLength={DESCRIPTION_MAX_LENGTH}
        multiline
        numberOfLines={4}
        onChangeText={setDescription}
      />

      <Button
        mode="outlined"
        icon="calendar"
        style={styles.pickerButton}
        onPress={() => openPicker('date')}
      >
        {date ? formatDate(date) : 'Selecionar data'}
      </Button>
      <HelperText type="error" visible={errors.date !== undefined}>
        {errors.date}
      </HelperText>

      <Button
        mode="outlined"
        icon="clock-outline"
        onPress={() => openPicker('time')}
      >
        {time ? formatTime(time) : 'Selecionar horário'}
      </Button>
      <HelperText type="error" visible={errors.time !== undefined}>
        {errors.time}
      </HelperText>

      {Platform.OS === 'ios' && iosPicker ? (
        <View>
          <DateTimePicker
            value={(iosPicker === 'date' ? date : time) ?? new Date()}
            mode={iosPicker}
            display="spinner"
            onValueChange={(_event, value) => applyPicked(iosPicker, value)}
          />
          <Button onPress={() => setIosPicker(null)}>Fechar seletor</Button>
        </View>
      ) : null}

      {saveError ? (
        <HelperText type="error" visible>
          {saveError}
        </HelperText>
      ) : null}

      <Button
        mode="contained"
        style={styles.save}
        loading={saving}
        disabled={saving}
        onPress={handleSave}
      >
        {taskId === undefined ? 'Criar tarefa' : 'Salvar alterações'}
      </Button>
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
  content: {
    padding: 16,
  },
  pickerButton: {
    marginTop: 16,
  },
  save: {
    marginTop: 16,
  },
});
