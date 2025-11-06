import { Tabs } from 'expo-router';
import { StyleSheet } from 'react-native';
import { enableScreens } from 'react-native-screens';
import { Ionicons } from '@expo/vector-icons';
import { AccountProvider } from '../src/context/AccountContext';
import { ThemeProvider, Colors } from '../src/theme/theme';

// Enable screens for better performance
enableScreens(true);

export default function TabLayout() {
  return (
    <ThemeProvider>
      <AccountProvider>
        <Tabs
          screenOptions={{
            headerShown: false,
            tabBarStyle: styles.tabBar,
            tabBarActiveTintColor: Colors.primary,
            tabBarInactiveTintColor: Colors.textMuted,
            tabBarLabelStyle: styles.tabBarLabel,
            tabBarShowLabel: true,
          }}
        >
          <Tabs.Screen
            name="index"
            options={{
              title: 'Etusivu',
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="home-outline" size={size} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="payment"
            options={{
              title: 'Maksut',
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="send-outline" size={size} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="raportit"
            options={{
              title: 'Raportit',
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="bar-chart-outline" size={size} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="asetukset"
            options={{
              title: 'Asetukset',
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="settings-outline" size={size} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="receipt"
            options={{
              title: 'Kuitti',
              href: null, // Hide from tab bar, accessible via navigation
            }}
          />
          <Tabs.Screen
            name="statement"
            options={{
              href: null, // Hide from tab bar
            }}
          />
        </Tabs>
      </AccountProvider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.card,
    borderTopColor: Colors.border,
    borderTopWidth: 1,
    height: 65,
    paddingBottom: 10,
    paddingTop: 10,
    ...StyleSheet.create({
      shadow: {
        shadowColor: Colors.shadow,
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 8,
      },
    }).shadow,
  },
  tabBarLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
});
