import { Tabs } from 'expo-router';
import { StyleSheet, View, Platform } from 'react-native';
import { enableScreens } from 'react-native-screens';
import { Colors } from '../constants';
import { Ionicons } from '@expo/vector-icons';
import { AccountProvider } from '../src/context/AccountContext';

// Enable screens for better performance
enableScreens(true);

export default function TabLayout() {
  return (
    <AccountProvider>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: styles.tabBar,
          tabBarActiveTintColor: Colors.neonGreen,
          tabBarInactiveTintColor: Colors.textSecondary,
          tabBarLabelStyle: styles.tabBarLabel,
          tabBarShowLabel: true,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Koti',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="payment"
          options={{
            title: 'Kassa',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="send" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="statement"
          options={{
            title: 'Tiliote',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="list" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="receipt"
          options={{
            title: 'Kuitti',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="document-text" size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    </AccountProvider>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.gray,
    borderTopColor: Colors.lightGray,
    borderTopWidth: 1,
    height: Platform.OS === 'ios' ? 85 : 65,
    paddingBottom: Platform.OS === 'ios' ? 20 : 10,
    paddingTop: 10,
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
});
