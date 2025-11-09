import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Etusivu from '../screens/Etusivu';
import Maksut from '../screens/Maksut';
import Raportit from '../screens/Raportit';
import Asetukset from '../screens/Asetukset';
import Kuitti from '../screens/Kuitti';
import { useTheme } from '../theme/theme';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function MainTabs() {
  const theme = useTheme();
  return (
    <Tab.Navigator screenOptions={{ headerShown: false, tabBarStyle: { backgroundColor: theme.colors.surface } }}>
      <Tab.Screen name="Etusivu" component={Etusivu} />
      <Tab.Screen name="Maksut" component={Maksut} />
      <Tab.Screen name="Raportit" component={Raportit} />
      <Tab.Screen name="Asetukset" component={Asetukset} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen name="Kuitti" component={Kuitti} />
    </Stack.Navigator>
  );
}
