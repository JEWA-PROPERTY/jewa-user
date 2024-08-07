import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, FlatList, SafeAreaView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { defaultStyles } from '~/constants/Styles';
import { router } from 'expo-router';

type Visitor = {
  id: string;
  type: 'individual' | 'group';
  eventType?: string;
  phoneNumbers: string[];
  otp: string;
  validUntil: Date;
};

const VisitorManagementPage: React.FC = () => {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [isAddingVisitor, setIsAddingVisitor] = useState(false);
  const [visitorType, setVisitorType] = useState<'individual' | 'group'>('individual');
  const [eventType, setEventType] = useState('');
  const [phoneNumbers, setPhoneNumbers] = useState('');

  const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

  const addVisitor = () => {
    if (phoneNumbers.trim() === '') {
      Alert.alert('Error', 'Please enter at least one phone number');
      return;
    }

    const newVisitor: Visitor = {
      id: Date.now().toString(),
      type: visitorType,
      eventType: visitorType === 'group' ? eventType : undefined,
      phoneNumbers: phoneNumbers.split(',').map(num => num.trim()),
      otp: generateOTP(),
      validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000), // Valid for 24 hours
    };

    setVisitors([...visitors, newVisitor]);
    setIsAddingVisitor(false);
    setEventType('');
    setPhoneNumbers('');
    
    // Here you would typically send the OTP to the provided phone numbers
    Alert.alert('Success', `OTP generated and sent to ${newVisitor.phoneNumbers.join(', ')}`);
  };

  const renderVisitorItem = ({ item }: { item: Visitor }) => (
    <View style={styles.visitorItem}>
      <Text style={styles.visitorType}>{item.type === 'group' ? 'Group' : 'Individual'}</Text>
      {item.eventType && <Text>Event: {item.eventType}</Text>}
      <Text>Phone(s): {item.phoneNumbers.join(', ')}</Text>
      <Text>OTP: {item.otp}</Text>
      <Text>Valid until: {item.validUntil.toLocaleString()}</Text>
    </View>
  );

  return (
    <SafeAreaView style={defaultStyles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>Visitor Management</Text>
        <TouchableOpacity onPress={() => setIsAddingVisitor(true)}>
          <Ionicons name="add-circle-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {isAddingVisitor ? (
        <View style={styles.addVisitorForm}>
          <TouchableOpacity
            style={[styles.typeButton, visitorType === 'individual' && styles.activeTypeButton]}
            onPress={() => setVisitorType('individual')}
          >
            <Text>Individual</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.typeButton, visitorType === 'group' && styles.activeTypeButton]}
            onPress={() => setVisitorType('group')}
          >
            <Text>Group</Text>
          </TouchableOpacity>

          {visitorType === 'group' && (
            <TextInput
              style={styles.input}
              placeholder="Event Type"
              value={eventType}
              onChangeText={setEventType}
            />
          )}

          <TextInput
            style={styles.input}
            placeholder="Phone Number(s) (comma-separated)"
            value={phoneNumbers}
            onChangeText={setPhoneNumbers}
            keyboardType="phone-pad"
          />

          <TouchableOpacity style={styles.addButton} onPress={addVisitor}>
            <Text style={styles.addButtonText}>Generate OTP</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={visitors}
          renderItem={renderVisitorItem}
          keyExtractor={item => item.id}
          ListEmptyComponent={<Text style={styles.emptyText}>No visitors added yet.</Text>}
        />
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
  addVisitorForm: {
    padding: 16,
  },
  typeButton: {
    padding: 8,
    marginBottom: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    alignItems: 'center',
  },
  activeTypeButton: {
    backgroundColor: '#a0a0a0',
  },
  input: {
    backgroundColor: '#fff',
    padding: 8,
    marginBottom: 8,
    borderRadius: 4,
  },
  addButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  visitorItem: {
    backgroundColor: '#fff',
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 8,
  },
  visitorType: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 32,
  },
});

export default VisitorManagementPage;