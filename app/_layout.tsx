import React from 'react';
import { Tabs } from 'expo-router';
import { StyleSheet, View, Platform } from 'react-native';
import { Colors, Layout, Spacing, FontSize } from '../src/theme/theme';
import { Ionicons } from '@expo/vector-icons';
import { AccountProvider } from '../src/context/AccountContext';

export default function TabLayout() {
  return (
    <AccountProvider>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: styles.tabBar,
          tabBarActiveTintColor: Colors.primary,
          tabBarInactiveTintColor: Colors.textSecondary,
          tabBarLabelStyle: styles.tabBarLabel,
          tabBarShowLabel: true,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Etusivu',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="payment"
          options={{
            title: 'Maksut',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="send" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="statement"
          options={{
            title: 'Raportit',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="bar-chart" size={size} color={color} />
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
        <Tabs.Screen
          name="settings"
          options={{
            title: 'Asetukset',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="settings" size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    </AccountProvider>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.background,
    borderTopColor: Colors.border,
    borderTopWidth: 1,
    height: Layout.tabBarHeight,
    paddingBottom: Platform.OS === 'ios' ? 20 : 10,
    paddingTop: 10,
  },
  tabBarLabel: {
    fontSize: FontSize.xs,
    fontWeight: '600',
  },
});
