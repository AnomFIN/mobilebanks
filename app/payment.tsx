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
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, FontSize, Shadow } from '../constants';
import { mockAccount } from '../mockData';

export default function PaymentScreen() {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [selectedContact, setSelectedContact] = useState<string | null>(null);

  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const quickContacts = [
    { id: '1', name: 'Anna', icon: 'person' },
    { id: '2', name: 'Mikko', icon: 'person' },
    { id: '3', name: 'Sofia', icon: 'person' },
    { id: '4', name: 'Janne', icon: 'person' },
  ];

  const quickAmounts = [10, 25, 50, 100];

  const handleSendPayment = () => {
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
    // In a real app, this would send the payment
    alert('Payment sent successfully! 🎉');
  };

  const handleContactPress = (contactId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedContact(contactId);
  };

  const handleAmountPress = (value: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setAmount(value.toString());
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
            <Text style={styles.title}>New Payment</Text>
            <Text style={styles.subtitle}>Send money instantly</Text>
          </View>

          {/* Balance Info */}
          <View style={styles.balanceInfo}>
            <Text style={styles.balanceLabel}>Available Balance</Text>
            <Text style={styles.balanceAmount}>
              {mockAccount.balance.toFixed(2)} €
            </Text>
          </View>

          {/* Quick Contacts */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Send</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.contactsList}
            >
              {quickContacts.map((contact) => (
                <TouchableOpacity
                  key={contact.id}
                  style={[
                    styles.contactItem,
                    selectedContact === contact.id && styles.contactItemSelected,
                  ]}
                  onPress={() => handleContactPress(contact.id)}
                >
                  <View
                    style={[
                      styles.contactIcon,
                      selectedContact === contact.id && styles.contactIconSelected,
                    ]}
                  >
                    <Ionicons
                      name={contact.icon as any}
                      size={28}
                      color={
                        selectedContact === contact.id ? Colors.black : Colors.neonGreen
                      }
                    />
                  </View>
                  <Text style={styles.contactName}>{contact.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Payment Form */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Payment Details</Text>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Recipient</Text>
              <View style={styles.inputWrapper}>
                <Ionicons
                  name="person-outline"
                  size={20}
                  color={Colors.textSecondary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Name or account number"
                  placeholderTextColor={Colors.textSecondary}
                  value={recipient}
                  onChangeText={setRecipient}
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Amount (€)</Text>
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

              {/* Quick Amount Buttons */}
              <View style={styles.quickAmounts}>
                {quickAmounts.map((value) => (
                  <TouchableOpacity
                    key={value}
                    style={styles.quickAmountButton}
                    onPress={() => handleAmountPress(value)}
                  >
                    <Text style={styles.quickAmountText}>{value}€</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Message (Optional)</Text>
              <View style={styles.inputWrapper}>
                <Ionicons
                  name="chatbox-outline"
                  size={20}
                  color={Colors.textSecondary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Add a note"
                  placeholderTextColor={Colors.textSecondary}
                  value={message}
                  onChangeText={setMessage}
                  multiline
                />
              </View>
            </View>
          </View>

          {/* Send Button */}
          <Animated.View style={[styles.sendButtonContainer, { transform: [{ scale: scaleAnim }] }]}>
            <TouchableOpacity
              style={styles.sendButton}
              onPress={handleSendPayment}
              disabled={!recipient || !amount}
            >
              <Text style={styles.sendButtonText}>Send Payment</Text>
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
  contactsList: {
    paddingRight: Spacing.lg,
  },
  contactItem: {
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  contactItemSelected: {
    opacity: 1,
  },
  contactIcon: {
    width: 64,
    height: 64,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  contactIconSelected: {
    backgroundColor: Colors.neonGreen,
    borderColor: Colors.neonGreen,
    ...Shadow.medium,
  },
  contactName: {
    fontSize: FontSize.sm,
    color: Colors.white,
    fontWeight: '600',
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
  quickAmounts: {
    flexDirection: 'row',
    marginTop: Spacing.md,
    gap: Spacing.sm,
  },
  quickAmountButton: {
    flex: 1,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.lightGray,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.lightGray,
  },
  quickAmountText: {
    fontSize: FontSize.sm,
    color: Colors.neonGreen,
    fontWeight: '600',
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
