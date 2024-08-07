import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput, Alert, Modal, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { defaultStyles } from '~/constants/Styles';

type DomesticHelp = {
  id: string;
  name: string;
  type: string;
  phoneNumber: string;
  passcode: string;
  status: 'in' | 'out';
  lastEntry?: Date;
  lastExit?: Date;
};

const DomesticHelpManagement: React.FC = () => {
  const [domesticHelps, setDomesticHelps] = useState<DomesticHelp[]>([]);
  const [isAddingHelp, setIsAddingHelp] = useState(false);
  const [newHelp, setNewHelp] = useState<Partial<DomesticHelp>>({});
  const [selectedHelp, setSelectedHelp] = useState<DomesticHelp | null>(null);

  useEffect(() => {
    // Fetch domestic helps data
    // This is where you'd typically make an API call
    // For now, we'll use dummy data
    setDomesticHelps([
      { id: '1', name: 'John Doe', type: 'Cook', phoneNumber: '1234567890', passcode: '123456', status: 'out' },
      { id: '2', name: 'Jane Smith', type: 'Maid', phoneNumber: '0987654321', passcode: '654321', status: 'in', lastEntry: new Date() },
    ]);
  }, []);

  const addDomesticHelp = () => {
    if (!newHelp.name || !newHelp.type || !newHelp.phoneNumber) {
        Alert.alert('Error', 'Please fill all fields');
        return;
    }
    const passcode = Math.floor(100000 + Math.random() * 900000).toString();
    const help: DomesticHelp = {
        ...newHelp as DomesticHelp,
        id: Date.now().toString(),
        passcode,
        status: 'out'
    };
    setDomesticHelps([...domesticHelps, help]);
    setIsAddingHelp(false);
    setNewHelp({});
    Alert.alert('Success', `Passcode for ${help.name}: ${passcode}`);
  };

  const updateHelpStatus = (id: string, status: 'in' | 'out') => {
    setDomesticHelps(domesticHelps.map(help => {
      if (help.id === id) {
        return {
          ...help,
          status,
          ...(status === 'in' ? { lastEntry: new Date() } : { lastExit: new Date() })
        };
      }
      return help;
    }));
  };

  const renderHelpItem = ({ item }: { item: DomesticHelp }) => (
    <TouchableOpacity style={styles.helpItem} onPress={() => setSelectedHelp(item)}>
      <View>
        <Text style={styles.helpName}>{item.name}</Text>
        <Text>{item.type}</Text>
        <Text>Status: {item.status}</Text>
      </View>
      <TouchableOpacity onPress={() => updateHelpStatus(item.id, item.status === 'in' ? 'out' : 'in')}>
        <Ionicons name={item.status === 'in' ? 'exit-outline' : 'enter-outline'} size={24} color="black" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={defaultStyles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Domestic Help Management</Text>
        <TouchableOpacity onPress={() => setIsAddingHelp(true)}>
          <Ionicons name="add-circle-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={domesticHelps}
        renderItem={renderHelpItem}
        keyExtractor={item => item.id}
        ListEmptyComponent={<Text style={styles.emptyText}>No domestic help registered.</Text>}
      />

      <Modal visible={isAddingHelp} animationType="slide">
        <SafeAreaView style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Add New Domestic Help</Text>
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={newHelp.name}
            onChangeText={text => setNewHelp({ ...newHelp, name: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Type (e.g., Cook, Maid)"
            value={newHelp.type}
            onChangeText={text => setNewHelp({ ...newHelp, type: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            value={newHelp.phoneNumber}
            onChangeText={text => setNewHelp({ ...newHelp, phoneNumber: text })}
            keyboardType="phone-pad"
          />
          <TouchableOpacity style={styles.addButton} onPress={addDomesticHelp}>
            <Text style={styles.addButtonText}>Add Domestic Help</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={() => setIsAddingHelp(false)}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </Modal>

      <Modal visible={!!selectedHelp} animationType="slide">
        <SafeAreaView style={styles.modalContainer}>
          {selectedHelp && (
            <>
              <Text style={styles.modalTitle}>{selectedHelp.name}</Text>
              <Text>Type: {selectedHelp.type}</Text>
              <Text>Phone: {selectedHelp.phoneNumber}</Text>
              <Text>Passcode: {selectedHelp.passcode}</Text>
              <Text>Status: {selectedHelp.status}</Text>
              {selectedHelp.lastEntry && <Text>Last Entry: {selectedHelp.lastEntry.toLocaleString()}</Text>}
              {selectedHelp.lastExit && <Text>Last Exit: {selectedHelp.lastExit.toLocaleString()}</Text>}
              <TouchableOpacity style={styles.closeButton} onPress={() => setSelectedHelp(null)}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </>
          )}
        </SafeAreaView>
      </Modal>
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
  helpItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 8,
  },
  helpName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 32,
  },
  modalContainer: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
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
    marginTop: 8,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#FF3B30',
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 8,
  },
  cancelButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  closeButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 16,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default DomesticHelpManagement;