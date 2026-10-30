import { useEffect, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Avatar } from 'react-native-paper';

// Espessura da borda fixa, igual em todo o aplicativo.
const BORDER_WIDTH = 3;

interface ProfileAvatarProps {
  size: number;
  borderColor: string;
  photoUri?: string;
}

export default function ProfileAvatar({ size, borderColor, photoUri }: ProfileAvatarProps) {
  const [failed, setFailed] = useState(false);
  const innerSize = size - BORDER_WIDTH * 2;

  useEffect(() => {
    setFailed(false);
  }, [photoUri]);

  return (
    <View
      style={[
        styles.container,
        { width: size, height: size, borderRadius: size / 2, borderColor },
      ]}
    >
      {photoUri && !failed ? (
        <Image
          source={{ uri: photoUri }}
          style={{ width: innerSize, height: innerSize, borderRadius: innerSize / 2 }}
          accessibilityLabel="Foto de perfil"
          onError={() => setFailed(true)}
        />
      ) : (
        <Avatar.Icon size={innerSize} icon="account" />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: BORDER_WIDTH,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
});
