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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, Spacing, BorderRadius, FontSize, Shadow } from '../constants';
import { useAccount } from '../src/context/AccountContext';

export default function PaymentScreen() {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const { balance, createPayment } = useAccount();
  const router = useRouter();

  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const handleCreatePayment = () => {
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

    // Navigate to statement screen
    router.push('/statement');
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
    backgroundColor: Colors.black,
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
    fontWeight: '700',
    color: Colors.white,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
  },
  balanceInfo: {
    marginHorizontal: Spacing.lg,
    padding: Spacing.lg,
    backgroundColor: Colors.gray,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    marginBottom: Spacing.xl,
  },
  balanceLabel: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  balanceAmount: {
    fontSize: FontSize.xxl,
    fontWeight: '700',
    color: Colors.neonGreen,
  },
  section: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: Colors.white,
    marginBottom: Spacing.md,
  },
  inputContainer: {
    marginBottom: Spacing.lg,
  },
  inputLabel: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
    fontWeight: '600',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.gray,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  inputIcon: {
    marginRight: Spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: FontSize.md,
    color: Colors.white,
    padding: Spacing.sm,
  },
  sendButtonContainer: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  sendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.neonGreen,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.md,
    ...Shadow.large,
  },
  sendButtonText: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: Colors.black,
    marginRight: Spacing.sm,
  },
});
