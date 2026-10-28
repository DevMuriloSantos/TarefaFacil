import { MaterialCommunityIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type { ComponentProps } from 'react';

import CompletedScreen from '../screens/CompletedScreen';
import HomeScreen from '../screens/HomeScreen';
import SettingsScreen from '../screens/SettingsScreen';
import type { TabParamList } from './types';

type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

// Rótulo das abas, também usado como título do cabeçalho compartilhado.
export const TAB_TITLES: Record<keyof TabParamList, string> = {
  Home: 'Principal',
  Completed: 'Concluídas',
  Settings: 'Configurações',
};

const TAB_ICONS: Record<keyof TabParamList, IconName> = {
  Home: 'format-list-checks',
  Completed: 'check-circle-outline',
  Settings: 'cog-outline',
};

export function isTabName(name: string | undefined): name is keyof TabParamList {
  return name !== undefined && name in TAB_TITLES;
}

const Tab = createBottomTabNavigator<TabParamList>();

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarLabel: TAB_TITLES[route.name],
        tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons
            name={TAB_ICONS[route.name]}
            size={size}
            color={color}
          />
        ),
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Completed" component={CompletedScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}
