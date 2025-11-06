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
  Animated,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, FontSize, Shadow, FontWeight } from '../src/theme/theme';
import { useAccount } from '../src/context/AccountContext';
import Card from '../src/components/Card';

export default function PaymentScreen() {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const { balance, createPayment } = useAccount();
  const router = useRouter();

  const scaleAnim = React.useRef(new Animated.Value(1)).current;
  const successAnim = React.useRef(new Animated.Value(0)).current;

  const presetAmounts = [5, 10, 20, 50, 100];

  const handlePresetAmount = (preset: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setAmount(preset.toString());
  };

  const handleCreatePayment = () => {
    if (!amount || parseFloat(amount) <= 0) {
      return;
    }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    // Create payment with coerced amount
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

    // Show success modal
    setShowSuccess(true);
    Animated.timing(successAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    // Auto dismiss after 2 seconds
    setTimeout(() => {
      setShowSuccess(false);
      successAnim.setValue(0);
      setAmount('');
      setDescription('');
      router.push('/statement');
    }, 2000);
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
            <Text style={styles.subtitle}>Luo uusi maksu nopeasti</Text>
          </View>

          {/* Balance Info */}
          <View style={styles.balanceSection}>
            <Card shadow="medium" padding={Spacing.lg}>
              <View style={styles.balanceRow}>
                <View>
                  <Text style={styles.balanceLabel}>Saldo</Text>
                  <Text style={styles.balanceAmount}>
                    {balance.toFixed(2)} €
                  </Text>
                </View>
                <View style={styles.balanceIcon}>
                  <Ionicons name="wallet" size={32} color={Colors.primary} />
                </View>
              </View>
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
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Summa</Text>
              <Card shadow="small" padding={Spacing.md}>
                <View style={styles.inputWrapper}>
                  <Ionicons
                    name="cash-outline"
                    size={24}
                    color={Colors.primary}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="0.00"
                    placeholderTextColor={Colors.textSecondary}
                    value={amount}
                    onChangeText={setAmount}
                    keyboardType="decimal-pad"
                  />
                  <Text style={styles.currency}>€</Text>
                </View>
              </Card>
            </View>

            {/* Preset Amounts */}
            <View style={styles.presetsContainer}>
              {presetAmounts.map((preset) => (
                <TouchableOpacity
                  key={preset}
                  style={styles.presetButton}
                  onPress={() => handlePresetAmount(preset)}
                >
                  <Text style={styles.presetText}>{preset}€</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Description Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Kuvaus (valinnainen)</Text>
              <Card shadow="small" padding={Spacing.md}>
                <View style={styles.inputWrapper}>
                  <Ionicons
                    name="chatbox-outline"
                    size={24}
                    color={Colors.primary}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Lisää viesti"
                    placeholderTextColor={Colors.textSecondary}
                    value={description}
                    onChangeText={setDescription}
                    multiline
                  />
                </View>
              </Card>
            </View>
          </View>

          {/* Create Payment Button */}
          <View style={styles.sendButtonContainer}>
            <TouchableOpacity
              style={[styles.sendButton, (!amount || Number(amount) <= 0) && styles.sendButtonDisabled]}
              onPress={handleCreatePayment}
              disabled={!amount || Number(amount) <= 0}
            >
              <Text style={styles.sendButtonText}>Luo maksu</Text>
              <Ionicons name="arrow-forward" size={20} color={Colors.white} />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Success Modal */}
      <Modal
        visible={showSuccess}
        transparent
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <Animated.View
            style={[
              styles.modalContent,
              {
                opacity: successAnim,
                transform: [
                  {
                    scale: successAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.8, 1],
                    }),
                  },
                ],
              },
            ]}
          >
            <View style={styles.successIcon}>
              <Ionicons name="checkmark-circle" size={64} color={Colors.success} />
            </View>
            <Text style={styles.modalTitle}>Onnistui!</Text>
            <Text style={styles.modalSubtitle}>Maksu luotu</Text>
          </Animated.View>
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
  balanceSection: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: FontSize.sm,
    color: Colors.white,
    opacity: 0.9,
    marginBottom: Spacing.xs,
    fontWeight: FontWeight.medium,
  },
  balanceAmount: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
  },
  balanceIcon: {
    width: 60,
    height: 60,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
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
  inputLabel: {
    fontSize: FontSize.sm,
    color: Colors.text,
    marginBottom: Spacing.sm,
    fontWeight: FontWeight.semibold,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    fontSize: FontSize.lg,
    color: Colors.text,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    fontWeight: FontWeight.medium,
  },
  currency: {
    fontSize: FontSize.lg,
    color: Colors.text,
    fontWeight: FontWeight.semibold,
  },
  presetsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  presetButton: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  presetText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.primary,
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
    backgroundColor: Colors.textSecondary,
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
    backgroundColor: Colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xxxl,
    alignItems: 'center',
    ...Shadow.large,
  },
  successIcon: {
    marginBottom: Spacing.lg,
  },
  modalTitle: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  modalSubtitle: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
  },
});
