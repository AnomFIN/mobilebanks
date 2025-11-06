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
import { HeaderBar } from '../src/components/HeaderBar';
import { Card } from '../src/components/Card';
import { Colors, Spacing, BorderRadius, FontSize, FontWeight, Shadow } from '../src/theme/theme';
import { useAccount } from '../src/context/AccountContext';

export default function PaymentScreen() {
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [description, setDescription] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const { balance, createPayment } = useAccount();
  const router = useRouter();

  const scaleAnim = React.useRef(new Animated.Value(1)).current;
  const successAnim = React.useRef(new Animated.Value(0)).current;

  const quickAmounts = [10, 25, 50, 100, 250];

  const handleQuickAmount = (value: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setAmount(value.toString());
  };

  const handleCreatePayment = () => {
    if (!amount || parseFloat(amount) <= 0) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    // Animate button
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

    // Create payment
    createPayment(Number(amount) || 0, description || undefined);

    // Show success modal with animation
    setShowSuccessModal(true);
    Animated.spring(successAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 50,
      friction: 7,
    }).start();

    // Auto-close and navigate after 2 seconds
    setTimeout(() => {
      setShowSuccessModal(false);
      successAnim.setValue(0);
      router.push('/statement');
      // Reset form
      setAmount('');
      setRecipient('');
      setDescription('');
    }, 2000);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <HeaderBar />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          {/* Title */}
          <View style={styles.titleSection}>
            <Text style={styles.title}>Maksut</Text>
            <Text style={styles.subtitle}>Luo uusi maksu</Text>
          </View>

          {/* Balance Info */}
          <View style={styles.balanceSection}>
            <Card gradient gradientColors={[Colors.primaryBlue, Colors.accentCyan]}>
              <View style={styles.balanceContent}>
                <Text style={styles.balanceLabel}>Käytettävissä oleva saldo</Text>
                <Text style={styles.balanceAmount}>
                  {balance.toFixed(2)} €
                </Text>
              </View>
            </Card>
          </View>

          {/* Contact Picker (Mock) */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Vastaanottaja</Text>
            <Card>
              <View style={styles.inputWrapper}>
                <Ionicons
                  name="person-outline"
                  size={20}
                  color={Colors.textSecondary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Valitse tai kirjoita nimi"
                  placeholderTextColor={Colors.textSecondary}
                  value={recipient}
                  onChangeText={setRecipient}
                />
              </View>
            </Card>
          </View>

          {/* Amount Input */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Summa</Text>
            <Card>
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
                  placeholderTextColor={Colors.textSecondary}
                  value={amount}
                  onChangeText={setAmount}
                  keyboardType="decimal-pad"
                />
                <Text style={styles.currencyLabel}>€</Text>
              </View>
            </Card>

            {/* Quick Amount Presets */}
            <View style={styles.presetsContainer}>
              {quickAmounts.map((value) => (
                <TouchableOpacity
                  key={value}
                  style={styles.presetButton}
                  onPress={() => handleQuickAmount(value)}
                >
                  <Text style={styles.presetText}>{value}€</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Kuvaus (valinnainen)</Text>
            <Card>
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
                  placeholderTextColor={Colors.textSecondary}
                  value={description}
                  onChangeText={setDescription}
                  multiline
                  numberOfLines={3}
                />
              </View>
            </Card>
          </View>

          {/* Create Payment Button */}
          <Animated.View style={[styles.buttonContainer, { transform: [{ scale: scaleAnim }] }]}>
            <TouchableOpacity
              style={styles.payButton}
              onPress={handleCreatePayment}
              accessibilityLabel="Vahvista maksu"
            >
              <Text style={styles.payButtonText}>Vahvista maksu</Text>
              <Ionicons name="arrow-forward" size={20} color={Colors.white} />
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Success Modal */}
      <Modal
        visible={showSuccessModal}
        transparent
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <Animated.View
            style={[
              styles.successModal,
              {
                transform: [
                  {
                    scale: successAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.3, 1],
                    }),
                  },
                ],
                opacity: successAnim,
              },
            ]}
          >
            <View style={styles.successIcon}>
              <Ionicons name="checkmark-circle" size={64} color={Colors.success} />
            </View>
            <Text style={styles.successTitle}>Maksu onnistui!</Text>
            <Text style={styles.successMessage}>
              Maksusi on käsitelty onnistuneesti
            </Text>
          </Animated.View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

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
            <Text style={styles.title}>Luo maksu</Text>
            <Text style={styles.subtitle}>Tee uusi maksu</Text>
          </View>

          {/* Balance Info */}
          <View style={styles.balanceInfo}>
            <Text style={styles.balanceLabel}>Käytettävissä oleva saldo</Text>
            <Text style={styles.balanceAmount}>
              {balance.toFixed(2)} €
            </Text>
          </View>

          {/* Payment Form */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Maksun tiedot</Text>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Summa (€)</Text>
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
                  placeholderTextColor={Colors.textSecondary}
                  value={amount}
                  onChangeText={setAmount}
                  keyboardType="decimal-pad"
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Kuvaus (valinnainen)</Text>
              <View style={styles.inputWrapper}>
                <Ionicons
                  name="chatbox-outline"
                  size={20}
                  color={Colors.textSecondary}
                  style={styles.inputIcon}
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
            </View>
          </View>

          {/* Create Payment Button */}
          <Animated.View style={[styles.sendButtonContainer, { transform: [{ scale: scaleAnim }] }]}>
            <TouchableOpacity
              style={styles.sendButton}
              onPress={handleCreatePayment}
            >
              <Text style={styles.sendButtonText}>Luo maksu</Text>
              <Ionicons name="arrow-forward" size={20} color={Colors.black} />
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.veryLightGray,
  },
  keyboardView: {
    flex: 1,
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
  balanceSection: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  balanceContent: {
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: FontSize.sm,
    color: Colors.white,
    opacity: 0.9,
    marginBottom: Spacing.xs,
  },
  balanceAmount: {
    fontSize: FontSize.xxxl,
    fontWeight: FontWeight.bold,
    color: Colors.white,
  },
  section: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputIcon: {
    marginRight: Spacing.md,
  },
  input: {
    flex: 1,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    padding: 0,
  },
  textArea: {
    minHeight: 60,
    textAlignVertical: 'top',
  },
  currencyLabel: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: Colors.textSecondary,
    marginLeft: Spacing.sm,
  },
  presetsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: Spacing.md,
    gap: Spacing.sm,
  },
  presetButton: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.primaryBlue,
    ...Shadow.small,
  },
  presetText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.primaryBlue,
  },
  buttonContainer: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
    marginTop: Spacing.md,
  },
  payButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primaryBlue,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.lg,
    ...Shadow.large,
    gap: Spacing.sm,
  },
  payButtonText: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.white,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  successModal: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xxl,
    alignItems: 'center',
    width: '80%',
    ...Shadow.large,
  },
  successIcon: {
    marginBottom: Spacing.lg,
  },
  successTitle: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  successMessage: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});
