import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Switch,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Colors, Spacing, BorderRadius, FontSize, FontWeight } from '../src/theme/theme';
import { useAccount } from '../src/context/AccountContext';
import Card from '../src/components/Card';
import HeaderBar from '../src/components/HeaderBar';
import { Transaction } from '../types';

type EditMode = 'none' | 'profile' | 'balance' | 'transactions' | 'add-transaction' | 'edit-transaction';

export default function AsetuksetScreen() {
  const {
    balance,
    accountNumber,
    accountHolderName,
    companyName,
    transactions,
    updateBalance,
    updateAccountHolderName,
    updateCompanyName,
    updateAccountNumber,
    addTransaction,
    updateTransaction,
    deleteTransaction
  } = useAccount();

  const [editMode, setEditMode] = useState<EditMode>('none');
  const [tempName, setTempName] = useState(accountHolderName);
  const [tempCompany, setTempCompany] = useState(companyName);
  const [tempIban, setTempIban] = useState(accountNumber);
  const [tempBalance, setTempBalance] = useState(balance.toString());
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  
  // New transaction form state
  const [newTransactionTitle, setNewTransactionTitle] = useState('');
  const [newTransactionAmount, setNewTransactionAmount] = useState('');
  const [newTransactionCategory, setNewTransactionCategory] = useState('');
  const [newTransactionType, setNewTransactionType] = useState<'credit' | 'debit'>('debit');

  const [hapticsEnabled, setHapticsEnabled] = useState(true);

  const handleHaptics = () => {
    if (hapticsEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handleSaveProfile = () => {
    handleHaptics();
    updateAccountHolderName(tempName);
    updateCompanyName(tempCompany);
    updateAccountNumber(tempIban);
    setEditMode('none');
    Alert.alert('Tallennettu', 'Profiilin tiedot päivitetty onnistuneesti');
  };

  const handleSaveBalance = () => {
    handleHaptics();
    const newBalance = parseFloat(tempBalance);
    if (isNaN(newBalance)) {
      Alert.alert('Virhe', 'Syötä kelvollinen saldo');
      return;
    }
    updateBalance(newBalance);
    setEditMode('none');
    Alert.alert('Tallennettu', 'Saldo päivitetty onnistuneesti');
  };

  const handleAddTransaction = () => {
    handleHaptics();
    const amount = parseFloat(newTransactionAmount);
    if (!newTransactionTitle || isNaN(amount)) {
      Alert.alert('Virhe', 'Täytä kaikki kentät oikein');
      return;
    }

    const transaction: Omit<Transaction, 'id'> = {
      title: newTransactionTitle,
      amount: newTransactionType === 'credit' ? Math.abs(amount) : -Math.abs(amount),
      date: new Date().toISOString(),
      category: newTransactionCategory || 'Muu',
      status: 'completed',
      type: newTransactionType,
    };

    addTransaction(transaction);
    
    // Reset form
    setNewTransactionTitle('');
    setNewTransactionAmount('');
    setNewTransactionCategory('');
    setEditMode('none');
    Alert.alert('Lisätty', 'Uusi tapahtuma lisätty onnistuneesti');
  };

  const handleEditTransaction = (transaction: Transaction) => {
    handleHaptics();
    setEditingTransaction(transaction);
    setNewTransactionTitle(transaction.title);
    setNewTransactionAmount(Math.abs(transaction.amount).toString());
    setNewTransactionCategory(transaction.category);
    setNewTransactionType(transaction.type);
    setEditMode('edit-transaction');
  };

  const handleUpdateTransaction = () => {
    if (!editingTransaction) return;
    
    handleHaptics();
    const amount = parseFloat(newTransactionAmount);
    if (!newTransactionTitle || isNaN(amount)) {
      Alert.alert('Virhe', 'Täytä kaikki kentät oikein');
      return;
    }

    const updatedData: Partial<Transaction> = {
      title: newTransactionTitle,
      amount: newTransactionType === 'credit' ? Math.abs(amount) : -Math.abs(amount),
      category: newTransactionCategory || 'Muu',
      type: newTransactionType,
    };

    updateTransaction(editingTransaction.id, updatedData);
    
    // Reset form
    setEditingTransaction(null);
    setNewTransactionTitle('');
    setNewTransactionAmount('');
    setNewTransactionCategory('');
    setEditMode('none');
    Alert.alert('Päivitetty', 'Tapahtuma päivitetty onnistuneesti');
  };

  const handleDeleteTransaction = (transactionId: string) => {
    handleHaptics();
    Alert.alert(
      'Poista tapahtuma',
      'Haluatko varmasti poistaa tämän tapahtuman?',
      [
        { text: 'Peruuta', style: 'cancel' },
        {
          text: 'Poista',
          style: 'destructive',
          onPress: () => {
            deleteTransaction(transactionId);
            Alert.alert('Poistettu', 'Tapahtuma poistettu onnistuneesti');
          },
        },
      ]
    );
  };

  const formatCurrency = (amount: number) => {
    return `${amount >= 0 ? '+' : ''}${amount.toFixed(2)} €`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fi-FI', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <HeaderBar />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Asetukset</Text>
          <Text style={styles.subtitle}>Hallitse tilin asetuksia ja tietoja</Text>
        </View>

        {/* Profile Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profiilin tiedot</Text>
          <Card style={styles.settingCard}>
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Tilinomistaja</Text>
                <Text style={styles.settingValue}>{accountHolderName}</Text>
              </View>
            </View>
            <View style={styles.separator} />
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Yritys</Text>
                <Text style={styles.settingValue}>{companyName}</Text>
              </View>
            </View>
            <View style={styles.separator} />
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>IBAN</Text>
                <Text style={styles.settingValue}>{accountNumber}</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setEditMode('profile')}
            >
              <Ionicons name="create-outline" size={20} color={Colors.primary} />
              <Text style={styles.editButtonText}>Muokkaa</Text>
            </TouchableOpacity>
          </Card>
        </View>

        {/* Balance Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tilin saldo</Text>
          <Card style={styles.settingCard}>
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Nykyinen saldo</Text>
                <Text style={[styles.settingValue, styles.balanceValue]}>
                  {balance.toFixed(2)} €
                </Text>
              </View>
              <TouchableOpacity
                style={styles.smallEditButton}
                onPress={() => setEditMode('balance')}
              >
                <Ionicons name="create-outline" size={18} color={Colors.primary} />
              </TouchableOpacity>
            </View>
          </Card>
        </View>

        {/* Transaction Management */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Tilitapahtumat ({transactions.length})</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setEditMode('add-transaction')}
            >
              <Ionicons name="add-circle" size={24} color={Colors.primary} />
            </TouchableOpacity>
          </View>
          
          <Card style={styles.transactionsCard}>
            {transactions.slice(0, 5).map((transaction, index) => (
              <View key={transaction.id}>
                <View style={styles.transactionItem}>
                  <View style={styles.transactionLeft}>
                    <View style={[styles.transactionIcon, { 
                      backgroundColor: transaction.type === 'credit' ? Colors.success + '20' : Colors.error + '20' 
                    }]}>
                      <Ionicons
                        name={transaction.type === 'credit' ? 'arrow-down' : 'arrow-up'}
                        size={16}
                        color={transaction.type === 'credit' ? Colors.success : Colors.error}
                      />
                    </View>
                    <View style={styles.transactionInfo}>
                      <Text style={styles.transactionTitle}>{transaction.title}</Text>
                      <Text style={styles.transactionDate}>{formatDate(transaction.date)}</Text>
                    </View>
                  </View>
                  <View style={styles.transactionRight}>
                    <Text style={[styles.transactionAmount, { 
                      color: transaction.type === 'credit' ? Colors.success : Colors.error 
                    }]}>
                      {formatCurrency(transaction.amount)}
                    </Text>
                    <View style={styles.transactionActions}>
                      <TouchableOpacity
                        onPress={() => handleEditTransaction(transaction)}
                        style={styles.actionButton}
                      >
                        <Ionicons name="create-outline" size={16} color={Colors.primary} />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => handleDeleteTransaction(transaction.id)}
                        style={styles.actionButton}
                      >
                        <Ionicons name="trash-outline" size={16} color={Colors.error} />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
                {index < Math.min(transactions.length, 5) - 1 && <View style={styles.separator} />}
              </View>
            ))}
            
            {transactions.length > 5 && (
              <TouchableOpacity
                style={styles.showMoreButton}
                onPress={() => setEditMode('transactions')}
              >
                <Text style={styles.showMoreText}>Näytä kaikki ({transactions.length})</Text>
                <Ionicons name="chevron-forward" size={16} color={Colors.primary} />
              </TouchableOpacity>
            )}
          </Card>
        </View>

        {/* App Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sovelluksen asetukset</Text>
          <Card style={styles.settingCard}>
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Haptiset</Text>
                <Text style={styles.settingDescription}>Värinät painalluksissa</Text>
              </View>
              <Switch
                value={hapticsEnabled}
                onValueChange={setHapticsEnabled}
                trackColor={{ false: Colors.border, true: Colors.primary + '40' }}
                thumbColor={hapticsEnabled ? Colors.primary : Colors.textSecondary}
              />
            </View>
          </Card>
        </View>
      </ScrollView>

      {/* Profile Edit Modal */}
      <Modal
        visible={editMode === 'profile'}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setEditMode('none')}>
              <Text style={styles.modalCancel}>Peruuta</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Muokkaa profiilia</Text>
            <TouchableOpacity onPress={handleSaveProfile}>
              <Text style={styles.modalSave}>Tallenna</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Tilinomistaja</Text>
              <TextInput
                style={styles.input}
                value={tempName}
                onChangeText={setTempName}
                placeholder="Syötä nimi"
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Yritys</Text>
              <TextInput
                style={styles.input}
                value={tempCompany}
                onChangeText={setTempCompany}
                placeholder="Syötä yrityksen nimi"
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>IBAN</Text>
              <TextInput
                style={styles.input}
                value={tempIban}
                onChangeText={setTempIban}
                placeholder="FI21 1234 5678 9012 34"
              />
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Balance Edit Modal */}
      <Modal
        visible={editMode === 'balance'}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setEditMode('none')}>
              <Text style={styles.modalCancel}>Peruuta</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Muokkaa saldoa</Text>
            <TouchableOpacity onPress={handleSaveBalance}>
              <Text style={styles.modalSave}>Tallenna</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.modalContent}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Uusi saldo (€)</Text>
              <TextInput
                style={styles.input}
                value={tempBalance}
                onChangeText={setTempBalance}
                placeholder="0.00"
                keyboardType="numeric"
              />
            </View>
          </View>
        </SafeAreaView>
      </Modal>

      {/* Add Transaction Modal */}
      <Modal
        visible={editMode === 'add-transaction' || editMode === 'edit-transaction'}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => {
              setEditMode('none');
              setEditingTransaction(null);
              setNewTransactionTitle('');
              setNewTransactionAmount('');
              setNewTransactionCategory('');
            }}>
              <Text style={styles.modalCancel}>Peruuta</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>
              {editMode === 'add-transaction' ? 'Lisää tapahtuma' : 'Muokkaa tapahtumaa'}
            </Text>
            <TouchableOpacity onPress={editMode === 'add-transaction' ? handleAddTransaction : handleUpdateTransaction}>
              <Text style={styles.modalSave}>
                {editMode === 'add-transaction' ? 'Lisää' : 'Tallenna'}
              </Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Kuvaus</Text>
              <TextInput
                style={styles.input}
                value={newTransactionTitle}
                onChangeText={setNewTransactionTitle}
                placeholder="Syötä tapahtuman kuvaus"
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Summa (€)</Text>
              <TextInput
                style={styles.input}
                value={newTransactionAmount}
                onChangeText={setNewTransactionAmount}
                placeholder="0.00"
                keyboardType="numeric"
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Kategoria</Text>
              <TextInput
                style={styles.input}
                value={newTransactionCategory}
                onChangeText={setNewTransactionCategory}
                placeholder="Syötä kategoria"
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Tyyppi</Text>
              <View style={styles.typeSelector}>
                <TouchableOpacity
                  style={[styles.typeButton, newTransactionType === 'debit' && styles.typeButtonActive]}
                  onPress={() => setNewTransactionType('debit')}
                >
                  <Text style={[styles.typeButtonText, newTransactionType === 'debit' && styles.typeButtonTextActive]}>
                    Meno
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.typeButton, newTransactionType === 'credit' && styles.typeButtonActive]}
                  onPress={() => setNewTransactionType('credit')}
                >
                  <Text style={[styles.typeButtonText, newTransactionType === 'credit' && styles.typeButtonTextActive]}>
                    Tulo
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
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
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.lg,
  },
  title: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
  },
  section: {
    marginBottom: Spacing.lg,
    paddingHorizontal: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  settingCard: {
    padding: Spacing.md,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  settingInfo: {
    flex: 1,
  },
  settingLabel: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.medium,
    color: Colors.text,
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  settingValue: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  balanceValue: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: Colors.primary,
  },
  separator: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: Spacing.xs,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    marginTop: Spacing.sm,
  },
  editButtonText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.medium,
    color: Colors.primary,
    marginLeft: Spacing.xs,
  },
  smallEditButton: {
    padding: Spacing.xs,
  },
  addButton: {
    padding: Spacing.xs,
  },
  transactionsCard: {
    padding: Spacing.md,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  transactionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.medium,
    color: Colors.text,
    marginBottom: 2,
  },
  transactionDate: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
  },
  transactionRight: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    marginBottom: Spacing.xs,
  },
  transactionActions: {
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  actionButton: {
    padding: Spacing.xs,
  },
  showMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    marginTop: Spacing.sm,
  },
  showMoreText: {
    fontSize: FontSize.sm,
    color: Colors.primary,
    marginRight: Spacing.xs,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  modalTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
  },
  modalCancel: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
  },
  modalSave: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.primary,
  },
  modalContent: {
    flex: 1,
    padding: Spacing.md,
  },
  inputGroup: {
    marginBottom: Spacing.lg,
  },
  inputLabel: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.medium,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    fontSize: FontSize.md,
    color: Colors.text,
    backgroundColor: Colors.card,
  },
  typeSelector: {
    flexDirection: 'row',
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  typeButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    backgroundColor: Colors.card,
  },
  typeButtonActive: {
    backgroundColor: Colors.primary,
  },
  typeButtonText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.medium,
    color: Colors.text,
  },
  typeButtonTextActive: {
    color: Colors.white,
  },
});