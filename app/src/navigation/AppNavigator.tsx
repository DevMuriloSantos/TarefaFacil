import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AppHeader from '../components/AppHeader';
import ProfileScreen from '../screens/ProfileScreen';
import TaskFormScreen from '../screens/TaskFormScreen';
import BottomTabNavigator, { isTabName, TAB_TITLES } from './BottomTabNavigator';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="MainTabs"
      screenOptions={{ header: (props) => <AppHeader {...props} /> }}
    >
      <Stack.Screen
        name="MainTabs"
        component={BottomTabNavigator}
        options={({ route }) => {
          const tabName = getFocusedRouteNameFromRoute(route);
          return { title: TAB_TITLES[isTabName(tabName) ? tabName : 'Home'] };
        }}
      />
      <Stack.Screen
        name="TaskForm"
        component={TaskFormScreen}
        options={({ route }) => ({
          title: route.params?.taskId ? 'Editar tarefa' : 'Nova tarefa',
        })}
      />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: 'Perfil' }}
      />
    </Stack.Navigator>
  );
}
