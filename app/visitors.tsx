import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, SafeAreaView, ActivityIndicator, Platform, Linking, Alert, TouchableOpacity } from 'react-native';
import { defaultStyles } from '~/constants/Styles';
import Colors from '~/constants/Colors';
import { useUserStore } from '~/store/user-storage';
import JewaText from '~/components/JewaText';
import { Feather, Ionicons } from '@expo/vector-icons';
import PreAuthorizeVisitorModal from '~/components/PreAuthorize';

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
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loadingModal, setLoadingModal] = useState(false);

  useEffect(() => {
    fetchVisitors();
  }, []);

  const callMobilePhone = async (phoneNumber: string) => {
    const url = Platform.OS === 'ios' ? `telprompt:${phoneNumber}` : `tel:${phoneNumber}`;
    try {
      await Linking.openURL(url);
    } catch (error) {
      console.error('Error opening phone app:', error);
      Alert.alert('Error', 'Unable to open phone app');
    }
  };

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

  const handlePreAuthorizeSubmit = async (formData: any) => {
    setLoadingModal(true);

    const payload = {
      phone: formData.phone,
      name: formData.name,
      house_id: parseInt(formData.house_id),
      resident_id: parseInt(formData.resident_id),
      mode_of_entry: formData.mode_of_entry,
      vehicle_number: formData.vehicle_number,
      verification_number: formData.verification_number
    }

    console.log('Pre-authorize visitor payload:', payload);
    try {
      const response = await fetch('https://jewapropertypro.com/infinity/api/preauthorisevisitor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([payload]),
      });

      console.log('Pre-authorize visitor response:', response);

      if (!response.ok) {
        throw new Error('Failed to pre-authorize visitor');
      }

      const data = await response.json();
      console.log('Pre-authorize visitor response:', data);
      Alert.alert('Success', 'Visitor pre-authorized successfully');
      fetchVisitors(); // Refresh the visitors list
      setIsModalVisible(false);
    } catch (error) {
      console.error('Error pre-authorizing visitor:', error);
      Alert.alert('Error', 'Failed to pre-authorize visitor');

    } finally {
      setLoadingModal(false);
    }
  };

  const renderVisitorItem = ({ item }: { item: Visitor }) => (
    <View style={styles.visitorItem}>
      <View style={[styles.iconCircle, { backgroundColor: Colors.primary }]}>
        <Ionicons name={'person-outline'} size={24} color="#fff" />
      </View>
      <View style={styles.visitorInfo}>
        <JewaText style={styles.visitorName}>{item.name}</JewaText>
        {item.otp && <JewaText>OTP: {item.otp}</JewaText>}
        <JewaText>Status: {item.prebooked_status}</JewaText>
        <JewaText>Time In: {item.time_in}</JewaText>
        <JewaText>Time Out: {item.time_out}</JewaText>
        <JewaText>Mode of Entry: {item.mode_of_entry}</JewaText>
        {item.event_type && <JewaText>Event: {item.event_type}</JewaText>}
        {item.vehicle_number && <JewaText>Vehicle: {item.vehicle_number.toUpperCase()}</JewaText>}
      </View>
      <TouchableOpacity onPress={() => callMobilePhone(item.phone)}>
        <Feather name="phone-call" size={24} color={Colors.primary} />
      </TouchableOpacity>
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
        <JewaText>{error}</JewaText>
      </View>
    );
  }

  return (
    <SafeAreaView style={defaultStyles.container}>
      <View style={styles.headerTop}>
        <JewaText style={styles.sectionTitle}>Visitors</JewaText>
        <TouchableOpacity
          style={{
            width: 200,
            height: 40,
            backgroundColor: Colors.primary,
            borderRadius: 5,
            justifyContent: 'center',
            alignItems: 'center',
            elevation: 4,
            display: 'flex',
          }}
          onPress={() => setIsModalVisible(true)}
        >
          <JewaText
            style={[
              styles.sectionTitle,
              {
                fontSize: 16,
                color: 'white',
              },
            ]}
          >
            Pre-authorize visitors
          </JewaText>
        </TouchableOpacity>
      </View>
      <FlatList
        data={visitors}
        renderItem={renderVisitorItem}
        keyExtractor={item => item.id.toString()}
        ListEmptyComponent={<JewaText style={styles.emptyJewaText}>No visitors found.</JewaText>}
      />
      <PreAuthorizeVisitorModal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSubmit={handlePreAuthorizeSubmit}
        loading={loadingModal}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Nunito_600SemiBold'
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
    fontFamily: 'Nunito_700Bold',
  },
  emptyJewaText: {
    textAlign: 'center',
    marginTop: 32,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  }
});

export default VisitorManagementPage;