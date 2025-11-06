import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, FontSize, Shadow, FontWeight } from '../src/theme/theme';
import { useAccount } from '../src/context/AccountContext';
import { Card } from '../src/components/Card';

// Mock contacts
const mockContacts = [
  { id: '1', name: 'Roope Ankka', avatar: 'person' },
  { id: '2', name: 'Tupu Ankka', avatar: 'person' },
  { id: '3', name: 'Hupu Ankka', avatar: 'person' },
  { id: '4', name: 'Lupu Ankka', avatar: 'person' },
];

const presetAmounts = [10, 25, 50, 100];

export default function PaymentScreen() {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [selectedContact, setSelectedContact] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const { balance, createPayment } = useAccount();
  const router = useRouter();

  const handleCreatePayment = () => {
    if (!amount || parseFloat(amount) <= 0) {
      return;
    }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    createPayment(Number(amount) || 0, description || undefined);
    
    // Show success modal
    setShowSuccessModal(true);
    
    // Hide modal after 2 seconds and navigate
    setTimeout(() => {
      setShowSuccessModal(false);
      setAmount('');
      setDescription('');
      setSelectedContact(null);
    }, 2000);
  };

  const handlePresetAmount = (preset: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setAmount(preset.toString());
  };

  const handleContactSelect = (contactId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedContact(contactId);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Maksut</Text>
            <Text style={styles.subtitle}>Luo uusi maksu</Text>
          </View>

          {/* Balance Info */}
          <View style={styles.balanceCardContainer}>
            <Card gradient gradientColors={[Colors.gradientStart, Colors.gradientEnd]}>
              <Text style={styles.balanceLabel}>Käytettävissä oleva saldo</Text>
              <Text style={styles.balanceAmount}>
                {balance.toFixed(2)} €
              </Text>
            </Card>
          </View>

          {/* Contact Picker */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Valitse vastaanottaja</Text>
            <View style={styles.contactsContainer}>
              {mockContacts.map((contact) => (
                <TouchableOpacity
                  key={contact.id}
                  style={[
                    styles.contactButton,
                    selectedContact === contact.id && styles.contactButtonActive,
                  ]}
                  onPress={() => handleContactSelect(contact.id)}
                  accessibilityLabel={`Select ${contact.name}`}
                  accessibilityRole="button"
                >
                  <View style={[
                    styles.contactAvatar,
                    selectedContact === contact.id && styles.contactAvatarActive,
                  ]}>
                    <Ionicons
                      name="person"
                      size={24}
                      color={selectedContact === contact.id ? Colors.white : Colors.primary}
                    />
                  </View>
                  <Text style={[
                    styles.contactName,
                    selectedContact === contact.id && styles.contactNameActive,
                  ]}>
                    {contact.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Amount Input */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Summa</Text>
            <View style={styles.inputContainer}>
              <View style={styles.inputWrapper}>
                <Ionicons
                  name="cash-outline"
                  size={20}
                  color={Colors.textSecondary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="0.00"
                  placeholderTextColor={Colors.textMuted}
                  value={amount}
                  onChangeText={setAmount}
                  keyboardType="decimal-pad"
                  accessibilityLabel="Payment amount"
                />
                <Text style={styles.currency}>€</Text>
              </View>
            </View>

            {/* Preset Amounts */}
            <View style={styles.presetsContainer}>
              {presetAmounts.map((preset) => (
                <TouchableOpacity
                  key={preset}
                  style={styles.presetButton}
                  onPress={() => handlePresetAmount(preset)}
                  accessibilityLabel={`Set amount to ${preset} euros`}
                  accessibilityRole="button"
                >
                  <Text style={styles.presetText}>+{preset}€</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Kuvaus (valinnainen)</Text>
            <View style={styles.inputContainer}>
              <View style={styles.inputWrapper}>
                <Ionicons
                  name="chatbox-outline"
                  size={20}
                  color={Colors.textSecondary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Lisää viesti"
                  placeholderTextColor={Colors.textMuted}
                  value={description}
                  onChangeText={setDescription}
                  multiline
                  numberOfLines={3}
                  accessibilityLabel="Payment description"
                />
              </View>
            </View>
          </View>

          {/* Create Payment Button */}
          <View style={styles.sendButtonContainer}>
            <TouchableOpacity
              style={[styles.sendButton, (!amount || parseFloat(amount) <= 0) && styles.sendButtonDisabled]}
              onPress={handleCreatePayment}
              disabled={!amount || parseFloat(amount) <= 0}
              accessibilityLabel="Confirm payment"
              accessibilityRole="button"
            >
              <Text style={styles.sendButtonText}>Luo maksu</Text>
              <Ionicons name="arrow-forward" size={20} color={Colors.white} />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Success Modal */}
      <Modal
        visible={showSuccessModal}
        transparent
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.successIcon}>
              <Ionicons name="checkmark-circle" size={64} color={Colors.success} />
            </View>
            <Text style={styles.modalTitle}>Maksu onnistui!</Text>
            <Text style={styles.modalSubtitle}>
              Maksu {amount}€ on lähetetty
            </Text>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  keyboardView: {
    flex: 1,
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
  balanceCardContainer: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  balanceLabel: {
    fontSize: FontSize.sm,
    color: Colors.white,
    opacity: 0.9,
    marginBottom: Spacing.xs,
    fontWeight: FontWeight.medium,
  },
  balanceAmount: {
    fontSize: FontSize.xxxl,
    fontWeight: FontWeight.bold,
    color: Colors.white,
  },
  section: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  contactsContainer: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  contactButton: {
    alignItems: 'center',
    flex: 1,
  },
  contactButtonActive: {
    // Active state handled by child elements
  },
  contactAvatar: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  contactAvatarActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
    ...Shadow.medium,
  },
  contactName: {
    fontSize: FontSize.xs,
    color: Colors.text,
    fontWeight: FontWeight.medium,
    textAlign: 'center',
  },
  contactNameActive: {
    color: Colors.primary,
    fontWeight: FontWeight.bold,
  },
  inputContainer: {
    marginBottom: Spacing.md,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    ...Shadow.small,
  },
  inputIcon: {
    marginRight: Spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: FontSize.lg,
    color: Colors.text,
    padding: 0,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  currency: {
    fontSize: FontSize.lg,
    color: Colors.textSecondary,
    fontWeight: FontWeight.semibold,
    marginLeft: Spacing.sm,
  },
  presetsContainer: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  presetButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.backgroundSecondary,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  presetText: {
    fontSize: FontSize.md,
    color: Colors.primary,
    fontWeight: FontWeight.semibold,
  },
  sendButtonContainer: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  sendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.md,
    ...Shadow.large,
  },
  sendButtonDisabled: {
    backgroundColor: Colors.textMuted,
    opacity: 0.5,
  },
  sendButtonText: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.white,
    marginRight: Spacing.sm,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: Colors.card,
    padding: Spacing.xxl,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
    margin: Spacing.lg,
    ...Shadow.large,
  },
  successIcon: {
    marginBottom: Spacing.lg,
  },
  modalTitle: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  modalSubtitle: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});
