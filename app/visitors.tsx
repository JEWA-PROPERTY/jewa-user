import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, FlatList, SafeAreaView, Image, Modal, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { defaultStyles } from '~/constants/Styles';
import { router } from 'expo-router';
import Colors from '~/constants/Colors';
import { Picker } from '@react-native-picker/picker';

type Visitor = {
  id: string;
  name: string;
  type: 'individual' | 'group';
  eventType?: string;
  phoneNumbers: string[];
  otp: string;
  validUntil: Date;
  avatar?: string;
  title?: string;
};

const VisitorManagementPage: React.FC = () => {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [pendingVisitors, setPendingVisitors] = useState<Visitor[]>([
    { id: '1', name: 'Amazon Delivery', title: 'Delivery', avatar: 'https://i.pravatar.cc/150?u=1', type: 'individual', phoneNumbers: ['1234567890'], otp: '123456', validUntil: new Date() },
    { id: '2', name: 'John Doe', title: 'Guest', avatar: 'https://i.pravatar.cc/150?u=2', type: 'individual', phoneNumbers: ['0987654321'], otp: '654321', validUntil: new Date() },
    { id: '3', name: 'Jane Smith', title: 'Maid', avatar: 'https://i.pravatar.cc/150?u=3', type: 'individual', phoneNumbers: ['1122334455'], otp: '789012', validUntil: new Date() },
  ]);
  const [isAddingVisitor, setIsAddingVisitor] = useState(false);
  const [visitorType, setVisitorType] = useState<'individual' | 'group'>('individual');
  const [eventType, setEventType] = useState('');
  const [phoneNumbers, setPhoneNumbers] = useState('');
  const [selectedVisitor, setSelectedVisitor] = useState<Visitor | null>(null);
  const [showApprovalModal, setShowApprovalModal] = useState(false);

  const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

  const addVisitor = () => {
    if (phoneNumbers.trim() === '') {
      Alert.alert('Error', 'Please enter at least one phone number');
      return;
    }

    const newVisitor: Visitor = {
      id: Date.now().toString(),
      name: `Visitor ${visitors.length + 1}`, // Placeholder name
      type: visitorType,
      eventType: visitorType === 'group' ? eventType : undefined,
      phoneNumbers: phoneNumbers.split(',').map(num => num.trim()),
      otp: generateOTP(),
      validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000), // Valid for 24 hours
      avatar: `https://i.pravatar.cc/150?u=${Date.now()}`, // Placeholder avatar
    };

    setVisitors([...visitors, newVisitor]);
    setIsAddingVisitor(false);
    setEventType('');
    setPhoneNumbers('');
  };

  const approveVisitor = (visitor: Visitor) => {
    setVisitors([...visitors, visitor]);
    setPendingVisitors(pendingVisitors.filter(v => v.id !== visitor.id));
    setShowApprovalModal(false);
  };

  const denyVisitor = (visitorId: string) => {
    setPendingVisitors(pendingVisitors.filter(v => v.id !== visitorId));
    setShowApprovalModal(false);
  };

  const renderPendingVisitorItem = ({ item }: { item: Visitor }) => (
    <TouchableOpacity 
      style={styles.pendingVisitorItem} 
      onPress={() => {
        setSelectedVisitor(item);
        setShowApprovalModal(true);
      }}
    >
      <Image source={{ uri: item.avatar }} style={styles.pendingAvatar} />
      <Text style={styles.pendingName}>{item.title}</Text>
    </TouchableOpacity>
  );

  const renderVisitorItem = ({ item }: { item: Visitor }) => (
    <TouchableOpacity style={styles.visitorItem} onPress={() => setSelectedVisitor(item)}>
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <View style={styles.visitorInfo}>
        <Text style={styles.visitorName}>{item.name}</Text>
        <Text>{item.type === 'group' ? 'Group' : 'Individual'}</Text>
        <Text>OTP: {item.otp}</Text>
      </View>
    </TouchableOpacity>
  );

  const VisitorTicket = () => (
    <Modal
      visible={!!selectedVisitor && !showApprovalModal}
      transparent
      animationType="slide"
      onRequestClose={() => setSelectedVisitor(null)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.ticketContainer}>
          <Image source={{ uri: selectedVisitor?.avatar }} style={styles.ticketAvatar} />
          <Text style={styles.ticketName}>{selectedVisitor?.name}</Text>
          <Text style={styles.ticketType}>{selectedVisitor?.type === 'group' ? 'Group' : 'Individual'}</Text>
          {selectedVisitor?.eventType && <Text style={styles.ticketEvent}>Event: {selectedVisitor.eventType}</Text>}
          <Text style={styles.ticketOTP}>OTP: {selectedVisitor?.otp}</Text>
          <Text style={styles.ticketValidity}>Valid until: {selectedVisitor?.validUntil.toLocaleString()}</Text>
          <TouchableOpacity style={styles.closeButton} onPress={() => setSelectedVisitor(null)}>
            <Ionicons name="close-circle" size={24} color={Colors.primary} />
          </TouchableOpacity>
          
        </View>
      </View>
    </Modal>
  );

  const ApprovalModal = () => (
    <Modal
      visible={showApprovalModal}
      transparent
      animationType="slide"
      onRequestClose={() => setShowApprovalModal(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.approvalContainer}>
          <Text style={styles.approvalTitle}>Approve {selectedVisitor?.title}?</Text>
          <View style={styles.approvalButtons}>
            <TouchableOpacity style={[styles.approvalButton, styles.approveButton]} onPress={() => approveVisitor(selectedVisitor!)}>
              <Text style={styles.approvalButtonText}>Approve</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.approvalButton, styles.denyButton]} onPress={() => denyVisitor(selectedVisitor!.id)}>
              <Text style={styles.approvalButtonText}>Deny</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
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

      <View style={styles.pendingVisitorsContainer}>
        <Text style={styles.sectionTitle}>Pending Approval</Text>
        <FlatList
          data={pendingVisitors}
          renderItem={renderPendingVisitorItem}
          keyExtractor={item => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </View>

      <View style={styles.approvedVisitorsContainer}>
        <Text style={styles.sectionTitle}>Approved Visitors</Text>
        <FlatList
          data={visitors}
          renderItem={renderVisitorItem}
          keyExtractor={item => item.id}
          ListEmptyComponent={<Text style={styles.emptyText}>No approved visitors yet.</Text>}
        />
      </View>

      <Modal
        visible={isAddingVisitor}
        transparent
        animationType="slide"
        onRequestClose={() => setIsAddingVisitor(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.addVisitorForm}>
            <Picker
              selectedValue={visitorType}
              onValueChange={(itemValue) => setVisitorType(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Individual" value="individual" />
              <Picker.Item label="Group" value="group" />
            </Picker>

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

            <TouchableOpacity style={defaultStyles.pillButton} onPress={addVisitor}>
              <Text style={defaultStyles.buttonText}>Generate OTP</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[defaultStyles.pillButton, styles.cancelButton]} onPress={() => setIsAddingVisitor(false)}>
              <Text style={defaultStyles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <VisitorTicket />
      <ApprovalModal />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    marginLeft: 16,
  },
  pendingVisitorsContainer: {
    marginBottom: 20,
  },
  pendingVisitorItem: {
    alignItems: 'center',
    marginHorizontal: 10,
  },
  pendingAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  pendingName: {
    marginTop: 5,
    fontSize: 12,
  },
  approvedVisitorsContainer: {
    flex: 1,
  },
  visitorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 8,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  visitorInfo: {
    flex: 1,
  },
  visitorName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  addVisitorForm: {
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 16,
    marginHorizontal: 20,
  },
  picker: {
    backgroundColor: Colors.lightGray,
    borderRadius: 16,
    marginBottom: 20,
  },
  input: {
    backgroundColor: Colors.lightGray,
    padding: 20,
    borderRadius: 16,
    fontSize: 20,
    marginBottom: 20,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 32,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  ticketContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    width: '80%',
  },
  ticketAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  ticketName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  ticketType: {
    fontSize: 18,
    marginBottom: 5,
  },
  ticketEvent: {
    fontSize: 16,
    marginBottom: 5,
  },
  ticketOTP: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  ticketValidity: {
    fontSize: 14,
    color: Colors.gray,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  approvalContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    width: '80%',
  },
  approvalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  approvalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  approvalButton: {
    padding: 10,
    borderRadius: 8,
    width: '45%',
    alignItems: 'center',
  },
  approveButton: {
    backgroundColor: Colors.teal,
  },
  denyButton: {
    backgroundColor: Colors.red,
  },
  approvalButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: Colors.gray,
    marginTop: 10,
  },
});

export default VisitorManagementPage;