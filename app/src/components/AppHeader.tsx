import type { NativeStackHeaderProps } from '@react-navigation/native-stack';
import { StyleSheet } from 'react-native';
import { Appbar, Avatar, TouchableRipple, useTheme } from 'react-native-paper';

const AVATAR_SIZE = 36;

export default function AppHeader({
  navigation,
  options,
  route,
  back,
}: NativeStackHeaderProps) {
  const theme = useTheme();
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
          style={[
            styles.avatarButton,
            { borderColor: theme.colors.primary },
          ]}
        >
          <Avatar.Icon size={AVATAR_SIZE - 4} icon="account" />
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
    borderWidth: 2,
    marginHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
