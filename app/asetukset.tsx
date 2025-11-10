import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Colors, Spacing, BorderRadius, FontSize, Shadow, FontWeight } from '../src/theme/theme';
import Card from '../src/components/Card';
import { useAccount } from '../src/context/AccountContext';

export default function AsetuksetScreen() {
  const [hapticsEnabled, setHapticsEnabled] = useState(true);
  const [animationsEnabled, setAnimationsEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const { language, setLanguage, showAccountWarning, setShowAccountWarning } = useAccount();

  const handleHapticsToggle = () => {
    if (hapticsEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setHapticsEnabled((prev) => !prev);
  };

  const handleAnimationsToggle = () => {
    if (hapticsEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setAnimationsEnabled((prev) => !prev);
  };

  const handleDarkModeToggle = () => {
    if (hapticsEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setDarkMode((prev) => !prev);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Asetukset</Text>
          <Text style={styles.subtitle}>Hallitse tilin asetuksia</Text>
        </View>

        {/* Account Info Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tilin tiedot</Text>
          <Card>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <View style={styles.settingIconContainer}>
                  <Ionicons name="language-outline" size={20} color={Colors.primary} />
                </View>
                <View>
                  <Text style={styles.settingLabel}>Kieli</Text>
                  <Text style={styles.settingDescription}>Valitse käyttöliittymän kieli (vain kuitti & tiliote käännetään)</Text>
                </View>
              </View>
              <View style={styles.langButtons}>
                <TouchableOpacity
                  style={[styles.langButton, language === 'fi' && styles.langButtonActive]}
                  onPress={() => setLanguage('fi')}
                >
                  <Text style={[styles.langButtonText, language === 'fi' && styles.langButtonTextActive]}>Suomi</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.langButton, language === 'en' && styles.langButtonActive]}
                  onPress={() => setLanguage('en')}
                >
                  <Text style={[styles.langButtonText, language === 'en' && styles.langButtonTextActive]}>English</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.infoRow}>
              <View style={styles.infoIconContainer}>
                <Ionicons name="person-outline" size={20} color={Colors.primary} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Käyttäjä</Text>
                <Text style={styles.infoValue}>Hei, Aku Ankka</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <View style={styles.infoIconContainer}>
                <Ionicons name="business-outline" size={20} color={Colors.primary} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Tilinomistaja</Text>
                <Text style={styles.infoValue}>Firma Oy</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <View style={styles.infoIconContainer}>
                <Ionicons name="card-outline" size={20} color={Colors.primary} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Tilinumero</Text>
                <Text style={styles.infoValue}>FI21 1234 5678 9012 34</Text>
              </View>
            </View>
          </Card>
        </View>

        {/* Preferences Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Asetukset</Text>
          <Card>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <View style={styles.settingIconContainer}>
                  <Ionicons name="phone-portrait-outline" size={20} color={Colors.primary} />
                </View>
                <View>
                  <Text style={styles.settingLabel}>Haptinen palaute</Text>
                  <Text style={styles.settingDescription}>Värinä kosketuksissa</Text>
                </View>
              </View>
              <Switch
                value={hapticsEnabled}
                onValueChange={handleHapticsToggle}
                trackColor={{ false: Colors.border, true: Colors.primaryLight }}
                thumbColor={hapticsEnabled ? Colors.primary : Colors.textMuted}
                accessibilityLabel="Toggle haptics"
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <View style={styles.settingIconContainer}>
                  <Ionicons name="sparkles-outline" size={20} color={Colors.primary} />
                </View>
                <View>
                  <Text style={styles.settingLabel}>Animaatiot</Text>
                  <Text style={styles.settingDescription}>Näytä siirtymäanimaatiot</Text>
                </View>
              </View>
              <Switch
                value={animationsEnabled}
                onValueChange={handleAnimationsToggle}
                trackColor={{ false: Colors.border, true: Colors.primaryLight }}
                thumbColor={animationsEnabled ? Colors.primary : Colors.textMuted}
                accessibilityLabel="Toggle animations"
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <View style={styles.settingIconContainer}>
                  <Ionicons name="moon-outline" size={20} color={Colors.primary} />
                </View>
                <View>
                  <Text style={styles.settingLabel}>Tumma tila</Text>
                  <Text style={styles.settingDescription}>Käytä tummaa teemaa</Text>
                </View>
              </View>
              <Switch
                value={darkMode}
                onValueChange={handleDarkModeToggle}
                trackColor={{ false: Colors.border, true: Colors.primaryLight }}
                thumbColor={darkMode ? Colors.primary : Colors.textMuted}
                accessibilityLabel="Toggle dark mode"
              />
            </View>
            <View style={styles.divider} />

            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <View style={styles.settingIconContainer}>
                  <Ionicons name="alert-circle-outline" size={20} color={Colors.warning} />
                </View>
                <View>
                  <Text style={styles.settingLabel}>{language === 'en' ? 'Warning banner' : 'Varoitusteksti'}</Text>
                  <Text style={styles.settingDescription}>{language === 'en' ? 'Show account warning on all screens' : 'Näytä tilivaroitus kaikilla sivuilla'}</Text>
                </View>
              </View>
              <Switch
                value={showAccountWarning}
                onValueChange={(v) => setShowAccountWarning(v)}
                trackColor={{ false: Colors.border, true: Colors.primaryLight }}
                thumbColor={showAccountWarning ? Colors.primary : Colors.textMuted}
                accessibilityLabel="Toggle account warning banner"
              />
            </View>
          </Card>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tietoja</Text>
          <Card>
            <View style={styles.aboutRow}>
              <Text style={styles.aboutLabel}>Versio</Text>
              <Text style={styles.aboutValue}>1.0.0</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.aboutRow}>
              <Text style={styles.aboutLabel}>Yritys</Text>
              <Text style={styles.aboutValue}>SumUp</Text>
            </View>
          </Card>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsSection}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              if (hapticsEnabled) {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              }
            }}
            accessibilityLabel="Contact support"
            accessibilityRole="button"
          >
            <Ionicons name="mail-outline" size={20} color={Colors.primary} />
            <Text style={styles.actionButtonText}>Ota yhteyttä tukeen</Text>
            <Ionicons name="chevron-forward" size={20} color={Colors.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              if (hapticsEnabled) {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              }
            }}
            accessibilityLabel="Privacy policy"
            accessibilityRole="button"
          >
            <Ionicons name="shield-checkmark-outline" size={20} color={Colors.primary} />
            <Text style={styles.actionButtonText}>Tietosuojakäytäntö</Text>
            <Ionicons name="chevron-forward" size={20} color={Colors.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.logoutButton]}
            onPress={() => {
              if (hapticsEnabled) {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
              }
            }}
            accessibilityLabel="Logout"
            accessibilityRole="button"
          >
            <Ionicons name="log-out-outline" size={20} color={Colors.error} />
            <Text style={[styles.actionButtonText, styles.logoutText]}>Kirjaudu ulos</Text>
            <Ionicons name="chevron-forward" size={20} color={Colors.error} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xl,
  },
  title: {
    fontSize: FontSize.xxxl,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
  },
  section: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  infoIconContainer: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs / 2,
  },
  infoValue: {
    fontSize: FontSize.md,
    color: Colors.text,
    fontWeight: FontWeight.semibold,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  settingInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  settingLabel: {
    fontSize: FontSize.md,
    color: Colors.text,
    fontWeight: FontWeight.semibold,
    marginBottom: Spacing.xs / 2,
  },
  settingDescription: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: Spacing.sm,
  },
  aboutRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  aboutLabel: {
    fontSize: FontSize.md,
    color: Colors.text,
    fontWeight: FontWeight.medium,
  },
  aboutValue: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
  },
  actionsSection: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadow.small,
  },
  actionButtonText: {
    flex: 1,
    fontSize: FontSize.md,
    color: Colors.text,
    fontWeight: FontWeight.semibold,
    marginLeft: Spacing.md,
  },
  logoutButton: {
    marginTop: Spacing.md,
  },
  logoutText: {
    color: Colors.error,
  },
  langButtons: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  langButton: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.card,
  },
  langButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  langButtonText: {
    fontSize: FontSize.sm,
    color: Colors.text,
  },
  langButtonTextActive: {
    color: Colors.white,
    fontWeight: FontWeight.semibold,
  },
});
