import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Switch,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { HeaderBar } from '../src/components/HeaderBar';
import { Card } from '../src/components/Card';
import { Colors, Spacing, BorderRadius, FontSize, FontWeight, Shadow } from '../src/theme/theme';

export default function SettingsScreen() {
  const [darkMode, setDarkMode] = useState(false);
  const [hapticsEnabled, setHapticsEnabled] = useState(true);
  const [animationsEnabled, setAnimationsEnabled] = useState(true);

  const handleToggle = (currentValue: boolean, setter: (value: boolean) => void) => {
    if (hapticsEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setter(!currentValue);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <HeaderBar
        onProfilePress={() => {
          if (hapticsEnabled) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          }
        }}
      />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Title */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>Asetukset</Text>
          <Text style={styles.subtitle}>Hallitse tilisi asetuksia</Text>
        </View>

        {/* Profile Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profiili</Text>
          <Card style={styles.profileCard}>
            <View style={styles.profileContent}>
              <View style={styles.profileIcon}>
                <Ionicons name="person" size={32} color={Colors.primaryBlue} />
              </View>
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>Aku Ankka</Text>
                <Text style={styles.profileDetail}>Tilinomistaja: Firma Oy</Text>
                <Text style={styles.profileAccount}>FI21 1234 5678 9012 34</Text>
              </View>
            </View>
          </Card>
        </View>

        {/* Appearance Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ulkoasu</Text>
          <Card>
            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <View style={[styles.iconContainer, { backgroundColor: Colors.veryLightGray }]}>
                  <Ionicons name="moon" size={20} color={Colors.primaryBlue} />
                </View>
                <View style={styles.settingTextContainer}>
                  <Text style={styles.settingLabel}>Tumma tila</Text>
                  <Text style={styles.settingDescription}>
                    Käytä tummaa väriteemaa
                  </Text>
                </View>
              </View>
              <Switch
                value={darkMode}
                onValueChange={() => handleToggle(darkMode, setDarkMode)}
                trackColor={{ false: Colors.lightGray, true: Colors.accentCyan }}
                thumbColor={Colors.white}
                ios_backgroundColor={Colors.lightGray}
              />
            </View>
          </Card>
        </View>

        {/* Preferences Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Asetukset</Text>
          <Card>
            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <View style={[styles.iconContainer, { backgroundColor: Colors.veryLightGray }]}>
                  <Ionicons name="phone-portrait" size={20} color={Colors.primaryBlue} />
                </View>
                <View style={styles.settingTextContainer}>
                  <Text style={styles.settingLabel}>Kosketuspalaute</Text>
                  <Text style={styles.settingDescription}>
                    Värinä painikkeiden painamisesta
                  </Text>
                </View>
              </View>
              <Switch
                value={hapticsEnabled}
                onValueChange={() => handleToggle(hapticsEnabled, setHapticsEnabled)}
                trackColor={{ false: Colors.lightGray, true: Colors.accentCyan }}
                thumbColor={Colors.white}
                ios_backgroundColor={Colors.lightGray}
              />
            </View>

            <View style={[styles.settingItem, styles.settingItemNoBorder]}>
              <View style={styles.settingLeft}>
                <View style={[styles.iconContainer, { backgroundColor: Colors.veryLightGray }]}>
                  <Ionicons name="flash" size={20} color={Colors.primaryBlue} />
                </View>
                <View style={styles.settingTextContainer}>
                  <Text style={styles.settingLabel}>Animaatiot</Text>
                  <Text style={styles.settingDescription}>
                    Näytä sujuvat siirtymäanimaatiot
                  </Text>
                </View>
              </View>
              <Switch
                value={animationsEnabled}
                onValueChange={() => handleToggle(animationsEnabled, setAnimationsEnabled)}
                trackColor={{ false: Colors.lightGray, true: Colors.accentCyan }}
                thumbColor={Colors.white}
                ios_backgroundColor={Colors.lightGray}
              />
            </View>
          </Card>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Toiminnot</Text>
          <Card>
            <TouchableOpacity
              style={styles.actionItem}
              onPress={() => {
                if (hapticsEnabled) {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }
              }}
            >
              <View style={styles.settingLeft}>
                <View style={[styles.iconContainer, { backgroundColor: Colors.veryLightGray }]}>
                  <Ionicons name="shield-checkmark" size={20} color={Colors.success} />
                </View>
                <Text style={styles.actionLabel}>Tietoturva</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionItem}
              onPress={() => {
                if (hapticsEnabled) {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }
              }}
            >
              <View style={styles.settingLeft}>
                <View style={[styles.iconContainer, { backgroundColor: Colors.veryLightGray }]}>
                  <Ionicons name="notifications" size={20} color={Colors.warning} />
                </View>
                <Text style={styles.actionLabel}>Ilmoitukset</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionItem, styles.actionItemNoBorder]}
              onPress={() => {
                if (hapticsEnabled) {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }
              }}
            >
              <View style={styles.settingLeft}>
                <View style={[styles.iconContainer, { backgroundColor: Colors.veryLightGray }]}>
                  <Ionicons name="help-circle" size={20} color={Colors.primaryBlue} />
                </View>
                <Text style={styles.actionLabel}>Tuki ja ohje</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
          </Card>
        </View>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appInfoText}>SumUp v1.0.0</Text>
          <Text style={styles.appInfoText}>© 2025 SumUp. All rights reserved.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.veryLightGray,
  },
  scrollView: {
    flex: 1,
  },
  titleSection: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.lg,
  },
  title: {
    fontSize: FontSize.xxxl,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
  },
  section: {
    marginBottom: Spacing.lg,
    paddingHorizontal: Spacing.lg,
  },
  sectionTitle: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  profileCard: {
    backgroundColor: Colors.white,
  },
  profileContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileIcon: {
    width: 64,
    height: 64,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.veryLightGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  profileDetail: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  profileAccount: {
    fontSize: FontSize.xs,
    color: Colors.textLight,
    fontFamily: 'monospace',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  settingItemNoBorder: {
    borderBottomWidth: 0,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  settingTextContainer: {
    flex: 1,
  },
  settingLabel: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  actionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  actionItemNoBorder: {
    borderBottomWidth: 0,
  },
  actionLabel: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
  },
  appInfo: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xl,
    alignItems: 'center',
  },
  appInfoText: {
    fontSize: FontSize.xs,
    color: Colors.textLight,
    marginBottom: 4,
  },
});
