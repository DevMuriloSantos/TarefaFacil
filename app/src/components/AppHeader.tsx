import type { NativeStackHeaderProps } from '@react-navigation/native-stack';
import { StyleSheet } from 'react-native';
import { Appbar, TouchableRipple, useTheme } from 'react-native-paper';

import { useProfile } from '../context/ProfileContext';
import { getBorderColor } from '../types/profile';
import ProfileAvatar from './ProfileAvatar';

const AVATAR_SIZE = 36;

export default function AppHeader({
  navigation,
  options,
  route,
  back,
}: NativeStackHeaderProps) {
  const theme = useTheme();
  const { profile } = useProfile();
  const title = options.title ?? route.name;
  const showAvatar = route.name !== 'Profile';

  return (
    <Appbar.Header>
      {back ? <Appbar.BackAction onPress={navigation.goBack} /> : null}
      <Appbar.Content title={title} />
      {showAvatar ? (
        <TouchableRipple
          accessibilityRole="button"
          accessibilityLabel="Abrir perfil"
          onPress={() => navigation.navigate('Profile')}
          borderless
          style={styles.avatarButton}
        >
          <ProfileAvatar
            size={AVATAR_SIZE}
            photoUri={profile?.photoUri}
            borderColor={
              profile ? getBorderColor(profile.borderColor) : theme.colors.primary
            }
          />
        </TouchableRipple>
      ) : null}
    </Appbar.Header>
  );
}

const styles = StyleSheet.create({
  avatarButton: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    marginHorizontal: 12,
  },
});
