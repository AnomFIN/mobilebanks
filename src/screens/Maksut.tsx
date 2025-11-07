import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme/theme';
import HeaderBar from '../components/HeaderBar';

const Maksut: React.FC = () => {
  const theme = useTheme();
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  const handlePayment = () => {
    if (!recipient || !amount) {
      return;
    }
    setShowModal(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
    
    setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setShowModal(false);
        setRecipient('');
        setAmount('');
        setMessage('');
      });
    }, 2000);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <HeaderBar small />
        
        <View style={styles.content}>
          <Text style={[styles.title, { color: theme.colors.text }]}>Uusi maksu</Text>
          
          <View style={[styles.formCard, { backgroundColor: theme.colors.surface }]}>
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.colors.text }]}>Saaja</Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme.colors.background, color: theme.colors.text, borderColor: theme.colors.muted + '40' }]}
                value={recipient}
                onChangeText={setRecipient}
                placeholder="Saajan nimi tai tilinumero"
                placeholderTextColor={theme.colors.muted}
                accessibilityLabel="Saajan nimi tai tilinumero"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.colors.text }]}>Summa (€)</Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme.colors.background, color: theme.colors.text, borderColor: theme.colors.muted + '40' }]}
                value={amount}
                onChangeText={setAmount}
                placeholder="0.00"
                keyboardType="decimal-pad"
                placeholderTextColor={theme.colors.muted}
                accessibilityLabel="Maksun summa euroina"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.colors.text }]}>Viesti (valinnainen)</Text>
              <TextInput
                style={[styles.input, styles.textArea, { backgroundColor: theme.colors.background, color: theme.colors.text, borderColor: theme.colors.muted + '40' }]}
                value={message}
                onChangeText={setMessage}
                placeholder="Lisää viesti maksuun"
                multiline
                numberOfLines={3}
                placeholderTextColor={theme.colors.muted}
                accessibilityLabel="Maksuviesti"
              />
            </View>

            <TouchableOpacity
              style={[styles.payButton, { backgroundColor: theme.colors.primary }]}
              onPress={handlePayment}
              accessibilityLabel="Lähetä maksu"
              accessibilityRole="button"
            >
              <Text style={styles.payButtonText}>Lähetä maksu</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.quickPaySection}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Pikasiirto</Text>
            <View style={styles.quickPayGrid}>
              {['Kauppa Oy', 'Vuokranantaja', 'Sähkölasku', 'Netti'].map((name, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.quickPayButton, { backgroundColor: theme.colors.surface }]}
                  onPress={() => setRecipient(name)}
                  accessibilityLabel={`Pikasiirto: ${name}`}
                >
                  <Text style={styles.quickPayIcon}>💰</Text>
                  <Text style={[styles.quickPayText, { color: theme.colors.text }]}>{name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      <Modal visible={showModal} transparent animationType="none">
        <View style={styles.modalOverlay}>
          <Animated.View style={[styles.modalContent, { backgroundColor: theme.colors.surface, opacity: fadeAnim }]}>
            <Text style={styles.modalIcon}>✅</Text>
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>Maksu lähetetty!</Text>
            <Text style={[styles.modalText, { color: theme.colors.muted }]}>
              {amount} € saajalle {recipient}
            </Text>
          </Animated.View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16 },
  title: { fontSize: 28, fontWeight: '700', marginBottom: 20 },
  formCard: { borderRadius: 16, padding: 20, marginBottom: 24 },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 8 },
  input: { borderWidth: 1, borderRadius: 12, padding: 14, fontSize: 16 },
  textArea: { height: 80, textAlignVertical: 'top' },
  payButton: { borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 8 },
  payButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  quickPaySection: { marginTop: 8 },
  sectionTitle: { fontSize: 20, fontWeight: '700', marginBottom: 16 },
  quickPayGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  quickPayButton: { width: '47%', borderRadius: 12, padding: 16, alignItems: 'center', marginBottom: 12 },
  quickPayIcon: { fontSize: 32, marginBottom: 8 },
  quickPayText: { fontSize: 14, fontWeight: '600' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { borderRadius: 20, padding: 32, alignItems: 'center', minWidth: 280 },
  modalIcon: { fontSize: 64, marginBottom: 16 },
  modalTitle: { fontSize: 24, fontWeight: '700', marginBottom: 8 },
  modalText: { fontSize: 16, textAlign: 'center' },
});

export default Maksut;
