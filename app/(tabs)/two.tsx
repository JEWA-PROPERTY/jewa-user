import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, SafeAreaView, TouchableOpacity, TextInput, Modal, ScrollView, Image } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Ionicons } from '@expo/vector-icons';
import Colors from '~/constants/Colors';
import { Picker } from '@react-native-picker/picker';
import VisitorManagementPage from '../visitors';
import DeliveryManagementPage from '~/pages/Delivery';

type TabParamList = {
  Delivery: undefined;
  Visitors: undefined;
  Issues: undefined;
};

const Tab = createMaterialTopTabNavigator<TabParamList>();

type ItemType = 'Delivery' | 'Visitor' | 'Issue';

interface BaseItem {
  id: string;
  status: 'pending' | 'approved';
  image: string;
}

interface DeliveryItem extends BaseItem {
  trackingNumber: string;
  courier: string;
  leaveAtDoor: boolean;
}

interface VisitorItem extends BaseItem {
  name: string;
  type: 'individual' | 'group';
  phoneNumber: string;
}

interface IssueItem extends BaseItem {
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
}

type Item = DeliveryItem | VisitorItem | IssueItem;

interface ItemsState {
  pending: Item[];
  approved: Item[];
}

function ManagementScreen({ type }: { type: ItemType }) {
  const [items, setItems] = useState<ItemsState>({ pending: [], approved: [] });
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddingItem, setIsAddingItem] = useState(false);

  useEffect(() => {
    // Simulated data fetch
    setItems({
      pending: [
        { id: '1', status: 'pending', image: 'https://example.com/image1.jpg', trackingNumber: 'TRK123', courier: 'FedEx', leaveAtDoor: true } as DeliveryItem,
        { id: '2', status: 'pending', image: 'https://example.com/image2.jpg', name: 'Jane Smith', type: 'group', phoneNumber: '0987654321' } as VisitorItem,
      ],
      approved: [
        { id: '3', status: 'approved', image: 'https://example.com/image3.jpg', title: 'Broken Light', description: 'Light in lobby not working', priority: 'medium' } as IssueItem,
      ],
    });
  }, []);

  const renderItem = (item: Item) => (
    <View key={item.id} style={styles.item}>
      <Image source={{ uri: item.image }} style={styles.itemImage} />
      <View style={styles.itemContent}>
        {'trackingNumber' in item && <Text>Tracking: {item.trackingNumber}</Text>}
        {'name' in item && <Text>Name: {item.name}</Text>}
        {'title' in item && <Text>Title: {item.title}</Text>}
        <Text>Status: {item.status}</Text>
      </View>
    </View>
  );

  const renderSection = (title: string, data: Item[]) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {data.map(renderItem)}
    </View>
  );

  return (
    <View style={styles.screenContainer}>
      {type === 'Visitor' && (
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search Visitors"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity style={styles.searchButton}>
            <Ionicons name="search" size={24} color={Colors.primary} />
          </TouchableOpacity>
        </View>
      )}
      <ScrollView>
        {renderSection('Pending', items.pending)}
        {renderSection('Approved', items.approved)}
      </ScrollView>

      <AddItemModal
        visible={isAddingItem}
        onClose={() => setIsAddingItem(false)}
        onAdd={(item) => {
          setItems({
            ...items,
            pending: [...items.pending, item],
          });
          setIsAddingItem(false);
        }}
        type={type}
      />
    </View>
  );
}

interface AddItemModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (item: Item) => void;
  type: ItemType;
}

const AddItemModal: React.FC<AddItemModalProps> = ({ visible, onClose, onAdd, type }) => {
  const [itemData, setItemData] = useState<Partial<Item>>({});

  const renderFields = () => {
    switch (type) {
      case 'Delivery':
        return (
          <>
            <TextInput
              style={styles.input}
              placeholder="Tracking Number"
              onChangeText={(text) => setItemData({ ...itemData, trackingNumber: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Courier"
              onChangeText={(text) => setItemData({ ...itemData, courier: text })}
            />
            <TouchableOpacity
              style={styles.checkbox}
              onPress={() => setItemData({ ...itemData, leaveAtDoor: !(itemData as DeliveryItem).leaveAtDoor })}
            >
              <Text>Leave at Door</Text>
              {(itemData as DeliveryItem).leaveAtDoor && <Text style={styles.checkmark}>✓</Text>}
            </TouchableOpacity>
          </>
        );
      case 'Visitor':
        return (
          <>
            <TextInput
              style={styles.input}
              placeholder="Visitor Name"
              onChangeText={(text) => setItemData({ ...itemData, name: text })}
            />
            <Picker
              selectedValue={(itemData as VisitorItem).type}
              onValueChange={(value: 'individual' | 'group') => setItemData({ ...itemData, type: value })}
              style={styles.picker}
            >
              <Picker.Item label="Individual" value="individual" />
              <Picker.Item label="Group" value="group" />
            </Picker>
            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              onChangeText={(text) => setItemData({ ...itemData, phoneNumber: text })}
            />
          </>
        );
      case 'Issue':
        return (
          <>
            <TextInput
              style={styles.input}
              placeholder="Issue Title"
              onChangeText={(text) => setItemData({ ...itemData, title: text })}
            />
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Issue Description"
              multiline
              numberOfLines={4}
              onChangeText={(text) => setItemData({ ...itemData, description: text })}
            />
            <Picker
              selectedValue={(itemData as IssueItem).priority}
              onValueChange={(value: 'low' | 'medium' | 'high') => setItemData({ ...itemData, priority: value })}
              style={styles.picker}
            >
              <Picker.Item label="Low" value="low" />
              <Picker.Item label="Medium" value="medium" />
              <Picker.Item label="High" value="high" />
            </Picker>
          </>
        );
    }
  };

  const handleAdd = () => {
    const newItem: Item = {
      id: Date.now().toString(),
      ...itemData,
      status: 'pending',
      image: 'https://example.com/placeholder.jpg',
    } as Item;
    onAdd(newItem);
    setItemData({});
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Add New {type}</Text>
          {renderFields()}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={onClose}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.addButton]} onPress={handleAdd}>
              <Text style={[styles.buttonText, styles.addButtonText]}>Add</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default function Home() {
  return (
    <SafeAreaView style={styles.container}>
      <Tab.Navigator
        screenOptions={{
          tabBarLabelStyle: { fontSize: 14, fontWeight: 'bold' },
          tabBarIndicatorStyle: { backgroundColor: Colors.primary },
          tabBarStyle: { backgroundColor: 'white' },
          tabBarScrollEnabled: false,
          tabBarContentContainerStyle: { justifyContent: 'center' },
        }}
      >
        <Tab.Screen name="Delivery" component={() => <DeliveryManagementPage />} />
        <Tab.Screen name="Visitors" component={() => <VisitorManagementPage />} />
        <Tab.Screen name="Issues" component={() => <ManagementScreen type="Issue" />} />
      </Tab.Navigator>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 80,
  },
  screenContainer: {
    flex: 1,
    backgroundColor: Colors.light,
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: 'white',
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    borderRadius: 8,
    padding: 8,
    marginRight: 8,
  },
  searchButton: {
    padding: 8,
    backgroundColor: Colors.lightGray,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    padding: 16,
    backgroundColor: "#fff",
  },
  item: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  itemContent: {
    flex: 1,
  },
  floatingButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.lightGray,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  picker: {
    borderWidth: 1,
    borderColor: Colors.lightGray,
    borderRadius: 5,
    marginBottom: 10,
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkmark: {
    marginLeft: 10,
    color: Colors.primary,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    backgroundColor: Colors.lightGray,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: Colors.primary,
  },
  addButtonText: {
    color: 'white',
  },
});