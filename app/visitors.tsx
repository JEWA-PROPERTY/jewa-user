import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, FlatList, SafeAreaView, Image, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { defaultStyles } from '~/constants/Styles';
import Colors from '~/constants/Colors';
import { useUserStore } from '~/store/user-storage';

type Visitor = {
  id: number;
  phone: string;
  name: string;
  house_id: number;
  resident_id: number;
  event_type: string | null;
  validity: string | null;
  time_in: string | null;
  time_out: string | null;
  image_url: string | null;
  prebooked_status: string;
  otp: string;
  notification_response: string | null;
  notif_id: string | null;
  mode_of_entry: string;
  verification_number: string | null;
  vehicle_number: string | null;
  created_at: string | null;
  updated_at: string | null;
};

const VisitorManagementPage: React.FC = () => {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUserStore();

  useEffect(() => {
    fetchVisitors();
  }, []);

  const fetchVisitors = async () => {
    if (!user || !user.userid) {
      setError('User ID not found');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('https://jewapropertypro.com/infinity/api/getallvisitors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resident_id: user.userid
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch visitors');
      }

      const data = await response.json();
      if (Array.isArray(data.message)) {
        setVisitors(data.message);
      } else {
        setError('Invalid data format received from the server');
      }
    } catch (err) {
      setError('An error occurred while fetching visitors');
    } finally {
      setLoading(false);
    }
  };

  const renderVisitorItem = ({ item }: { item: Visitor }) => (
    <View style={styles.visitorItem}>
      <Image
        source={{ uri: item.image_url || 'https://i.pravatar.cc/150?u=1' }}
        style={styles.avatar}
      />
      <View style={styles.visitorInfo}>
        <Text style={styles.visitorName}>{item.name}</Text>
        <Text>Phone: {item.phone}</Text>
        <Text>OTP: {item.otp}</Text>
        <Text>Status: {item.prebooked_status}</Text>
        {item.event_type && <Text>Event: {item.event_type}</Text>}
        {item.vehicle_number && <Text>Vehicle: {item.vehicle_number}</Text>}
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centeredContainer}>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={defaultStyles.container}>
      <View style={styles.headerTop}>
        <Text style={styles.sectionTitle}>Visitors</Text>
        {/* <TouchableOpacity style={styles.addButton} onPress={() => console.log("Hello")}>
          <Ionicons name="add-circle-outline" size={32} color="white" />
        </TouchableOpacity> */}
      </View>
      <FlatList
        data={visitors}
        renderItem={renderVisitorItem}
        keyExtractor={item => item.id.toString()}
        ListEmptyComponent={<Text style={styles.emptyText}>No visitors found.</Text>}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    marginLeft: 21,
  },
  addButton: {
    backgroundColor: Colors.primary,
    width: 45,
    height: 45,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  input: {
    backgroundColor: Colors.lightGray,
    padding: 10,
    borderRadius: 10,
    fontSize: 20,
    marginBottom: 20,
    width: '80%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  emptyText: {
    textAlign: 'center',
    marginTop: 32,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default VisitorManagementPage;