import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme/theme';
import HeaderBar from '../components/HeaderBar';

const Asetukset: React.FC = () => {
  const theme = useTheme();
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [biometricsEnabled, setBiometricsEnabled] = React.useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = React.useState(true);

  const settingsSections = [
    {
      title: 'Tili',
      items: [
        { icon: '👤', label: 'Profiili', action: () => {} },
        { icon: '🏢', label: 'Yritystiedot', action: () => {} },
        { icon: '💳', label: 'Maksutavat', action: () => {} },
      ],
    },
    {
      title: 'Turvallisuus',
      items: [
        { icon: '🔔', label: 'Ilmoitukset', toggle: notificationsEnabled, onToggle: setNotificationsEnabled },
        { icon: '🔐', label: 'Biometria', toggle: biometricsEnabled, onToggle: setBiometricsEnabled },
        { icon: '🔑', label: 'Kaksivaiheinen tunnistus', toggle: twoFactorEnabled, onToggle: setTwoFactorEnabled },
      ],
    },
    {
      title: 'Yleiset',
      items: [
        { icon: '🌐', label: 'Kieli', value: 'Suomi', action: () => {} },
        { icon: '💱', label: 'Valuutta', value: 'EUR (€)', action: () => {} },
        { icon: '❓', label: 'Ohje ja tuki', action: () => {} },
        { icon: '📄', label: 'Käyttöehdot', action: () => {} },
      ],
    },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <HeaderBar small />
        
        <View style={styles.content}>
          <Text style={[styles.title, { color: theme.colors.text }]}>Asetukset</Text>
          
          <View style={[styles.profileCard, { backgroundColor: theme.colors.surface }]}>
            <View style={[styles.avatarCircle, { backgroundColor: theme.colors.primary }]}>
              <Text style={styles.avatarText}>AA</Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={[styles.profileName, { color: theme.colors.text }]}>Aku Ankka</Text>
              <Text style={[styles.profileEmail, { color: theme.colors.muted }]}>aku.ankka@firma.fi</Text>
              <Text style={[styles.profileCompany, { color: theme.colors.muted }]}>Firma Oy</Text>
            </View>
            <TouchableOpacity 
              style={styles.editButton}
              accessibilityLabel="Muokkaa profiilia"
              accessibilityRole="button"
            >
              <Text style={styles.editIcon}>✏️</Text>
            </TouchableOpacity>
          </View>

          {settingsSections.map((section, sectionIndex) => (
            <View key={sectionIndex} style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>{section.title}</Text>
              <View style={[styles.settingsCard, { backgroundColor: theme.colors.surface }]}>
                {section.items.map((item, itemIndex) => (
                  <View key={itemIndex}>
                    <TouchableOpacity
                      style={styles.settingItem}
                      onPress={'action' in item ? item.action : undefined}
                      disabled={'toggle' in item}
                      accessibilityLabel={item.label}
                      accessibilityRole="button"
                    >
                      <View style={styles.settingLeft}>
                        <Text style={styles.settingIcon}>{item.icon}</Text>
                        <Text style={[styles.settingLabel, { color: theme.colors.text }]}>{item.label}</Text>
                      </View>
                      <View style={styles.settingRight}>
                        {'value' in item && item.value && (
                          <Text style={[styles.settingValue, { color: theme.colors.muted }]}>{item.value}</Text>
                        )}
                        {'toggle' in item && item.onToggle && (
                          <Switch
                            value={item.toggle}
                            onValueChange={item.onToggle}
                            trackColor={{ false: theme.colors.muted + '40', true: theme.colors.primary + '60' }}
                            thumbColor={item.toggle ? theme.colors.primary : '#f4f3f4'}
                            accessibilityLabel={`Toggle ${item.label}`}
                          />
                        )}
                        {'action' in item && !('toggle' in item) && (
                          <Text style={[styles.settingArrow, { color: theme.colors.muted }]}>›</Text>
                        )}
                      </View>
                    </TouchableOpacity>
                    {itemIndex < section.items.length - 1 && (
                      <View style={[styles.divider, { backgroundColor: theme.colors.muted + '20' }]} />
                    )}
                  </View>
                ))}
              </View>
            </View>
          ))}

          <TouchableOpacity 
            style={[styles.logoutButton, { backgroundColor: theme.colors.surface }]}
            accessibilityLabel="Kirjaudu ulos"
            accessibilityRole="button"
          >
            <Text style={styles.logoutIcon}>🚪</Text>
            <Text style={[styles.logoutText, { color: '#FF3B30' }]}>Kirjaudu ulos</Text>
          </TouchableOpacity>

          <Text style={[styles.versionText, { color: theme.colors.muted }]}>
            SumUp Mobile v1.0.0
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 40 },
  title: { fontSize: 28, fontWeight: '700', marginBottom: 20 },
  profileCard: { borderRadius: 16, padding: 20, marginBottom: 24, flexDirection: 'row', alignItems: 'center' },
  avatarCircle: { width: 64, height: 64, borderRadius: 32, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  avatarText: { color: '#FFFFFF', fontSize: 24, fontWeight: '700' },
  profileInfo: { flex: 1 },
  profileName: { fontSize: 18, fontWeight: '700', marginBottom: 4 },
  profileEmail: { fontSize: 14, marginBottom: 2 },
  profileCompany: { fontSize: 14 },
  editButton: { padding: 8 },
  editIcon: { fontSize: 20 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 12, paddingHorizontal: 4 },
  settingsCard: { borderRadius: 16, overflow: 'hidden' },
  settingItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
  settingLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  settingIcon: { fontSize: 20, marginRight: 12, width: 24 },
  settingLabel: { fontSize: 16, fontWeight: '500' },
  settingRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  settingValue: { fontSize: 14 },
  settingArrow: { fontSize: 20, fontWeight: '300' },
  divider: { height: 1, marginLeft: 56 },
  logoutButton: { borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 8 },
  logoutIcon: { fontSize: 20, marginRight: 8 },
  logoutText: { fontSize: 16, fontWeight: '700' },
  versionText: { textAlign: 'center', fontSize: 12, marginTop: 24 },
});

export default Asetukset;
