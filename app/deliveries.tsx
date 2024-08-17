import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, FlatList, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import JewaText from '~/components/JewaText';

type Delivery = {
  id: string;
  service: string;
  eta?: string;
  status: 'incoming' | 'received' | 'left_at_gate' | 'denied';
  date: string;
  otp?: string;
};

const OTPScreen: React.FC<{ delivery: Delivery; onClose: () => void }> = ({ delivery, onClose }) => (
  <View style={styles.otpScreen}>
    <JewaText style={styles.otpTitle}>OTP for {delivery.service}</JewaText>
    <JewaText style={styles.otpCode}>{delivery.otp}</JewaText>
    <JewaText style={styles.otpInfo}>Use this code to collect your delivery from the gate</JewaText>
    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
      <JewaText style={styles.closeButtonJewaText}>Close</JewaText>
    </TouchableOpacity>
  </View>
);

const DeliveriesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'incoming' | 'history'>('incoming');
  const [selectedDeliveryId, setSelectedDeliveryId] = useState<string | null>(null);
  const [deliveries, setDeliveries] = useState<Delivery[]>([
    { id: '1', service: 'FedEx', eta: '2:00 PM', status: 'incoming', date: '2024-08-07' },
    { id: '2', service: 'UPS', eta: '3:30 PM', status: 'incoming', date: '2024-08-07' },
    { id: '3', service: 'Amazon', status: 'received', date: '2024-08-06' },
    { id: '4', service: 'DHL', status: 'left_at_gate', date: '2024-08-05', otp: '123456' },
  ]);

  const handleDeliveryAction = (id: string, action: 'leave' | 'allow' | 'deny') => {
    setDeliveries(deliveries.map(delivery => {
      if (delivery.id === id) {
        switch (action) {
          case 'leave':
            setSelectedDeliveryId(id);
            return { ...delivery, status: 'left_at_gate', otp: Math.floor(100000 + Math.random() * 900000).toString() };
          case 'allow':
            return { ...delivery, status: 'received' };
          case 'deny':
            return { ...delivery, status: 'denied' };
        }
      }
      return delivery;
    }));
  };

  const closeOTPScreen = () => setSelectedDeliveryId(null);

  const renderDeliveryItem = ({ item }: { item: Delivery }) => (
    <View style={styles.deliveryItem}>
      <JewaText style={styles.deliveryService}>{item.service}</JewaText>
      <JewaText>{item.date} {item.eta ? `- ETA: ${item.eta}` : ''}</JewaText>
      {item.status === 'incoming' ? (
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton} onPress={() => handleDeliveryAction(item.id, 'leave')}>
            <JewaText>Leave at Gate</JewaText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={() => handleDeliveryAction(item.id, 'allow')}>
            <JewaText>Allow In</JewaText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={() => handleDeliveryAction(item.id, 'deny')}>
            <JewaText>Deny</JewaText>
          </TouchableOpacity>
        </View>
      ) : (
        <JewaText style={styles.statusJewaText}>{item.status.replace('_', ' ')}</JewaText>
      )}
      {item.status === 'left_at_gate' && (
        <TouchableOpacity onPress={() => setSelectedDeliveryId(item.id)}>
          <JewaText style={styles.viewOtpButton}>View OTP</JewaText>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {selectedDeliveryId ? (
        <OTPScreen 
          delivery={deliveries.find(d => d.id === selectedDeliveryId)!} 
          onClose={closeOTPScreen} 
        />
      ) : (
        <>
          <View style={styles.header}>
            <JewaText style={styles.title}>Deliveries</JewaText>
            <Ionicons name="notifications-outline" size={24} color="black" />
          </View>
          
          <View style={styles.tabBar}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'incoming' && styles.activeTab]}
              onPress={() => setActiveTab('incoming')}
            >
              <JewaText>Incoming</JewaText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'history' && styles.activeTab]}
              onPress={() => setActiveTab('history')}
            >
              <JewaText>History</JewaText>
            </TouchableOpacity>
          </View>

          <FlatList
            data={deliveries.filter(d => activeTab === 'incoming' ? d.status === 'incoming' : d.status !== 'incoming')}
            renderItem={renderDeliveryItem}
            keyExtractor={item => item.id}
            ListEmptyComponent={<JewaText style={styles.emptyJewaText}>No deliveries at the moment.</JewaText>}
          />
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  tabBar: {
    flexDirection: 'row',
    marginBottom: 16,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    backgroundColor: '#e0e0e0',
  },
  activeTab: {
    backgroundColor: '#fff',
  },
  deliveryItem: {
    backgroundColor: '#fff',
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 8,
  },
  deliveryService: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Nunito_700Bold',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  actionButton: {
    backgroundColor: '#e0e0e0',
    padding: 8,
    borderRadius: 4,
  },
  statusJewaText: {
    marginTop: 8,
    fontStyle: 'italic',
  },
  viewOtpButton: {
    marginTop: 8,
    color: 'blue',
    textDecorationLine: 'underline',
  },
  emptyJewaText: {
    textAlign: 'center',
    marginTop: 32,
  },
  otpScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.9)',
  },
  otpTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
    fontFamily: 'Nunito_700Bold',
  },
  otpCode: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  otpInfo: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 32,
  },
  closeButton: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  closeButtonJewaText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default DeliveriesPage;