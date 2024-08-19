import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, SafeAreaView, ActivityIndicator, Platform, Linking, Alert, TouchableOpacity } from 'react-native';
import { defaultStyles } from '~/constants/Styles';
import Colors from '~/constants/Colors';
import { useUserStore } from '~/store/user-storage';
import JewaText from '~/components/JewaText';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
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
  otp_status: string;
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
  const [expandedVisitor, setExpandedVisitor] = useState<number | null>(null);

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
      house_id: 1,
      resident_id: user?.userid,
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
      fetchVisitors();
      setIsModalVisible(false);
    } catch (error) {
      console.error('Error pre-authorizing visitor:', error);
      Alert.alert('Error', 'Failed to pre-authorize visitor');
    } finally {
      setIsModalVisible(false);
      setLoadingModal(false);
    }
  };

  const revokeValidity = async (visitorId: number) => {
    Alert.alert(
      "Revoke OTP Validity",
      "Are you sure you want to revoke the validity of this OTP?",
      [
        { text: "No", style: "cancel" },
        { 
          text: "Yes", 
          onPress: async () => {
            try {
              const response = await fetch('https://jewapropertypro.com/infinity/api/otprevoked', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ visitor_id: visitorId }),
              });

              if (!response.ok) {
                throw new Error('Failed to revoke OTP');
              }

              Alert.alert('Success', 'OTP validity revoked successfully');
              fetchVisitors();
            } catch (error) {
              console.error('Error revoking OTP:', error);
              Alert.alert('Error', 'Failed to revoke OTP validity');
            }
          }
        }
      ]
    );
  };

  const renderVisitorItem = ({ item }: { item: Visitor }) => (
    <TouchableOpacity 
      style={styles.visitorItem}
      onPress={() => setExpandedVisitor(expandedVisitor === item.id ? null : item.id)}
    >
      <View style={styles.visitorHeader}>
        <View style={[styles.iconCircle, { backgroundColor: Colors.primary }]}>
          <Ionicons name={'person-outline'} size={24} color="#fff" />
        </View>
        <View style={styles.visitorInfo}>
          <JewaText style={styles.visitorName}>{item.name}</JewaText>
          <JewaText>Status: {item.prebooked_status}</JewaText>
          <JewaText>Validity: {item.validity || 0} days</JewaText>
        </View>
        <View style={styles.actionButtons}>
          <TouchableOpacity onPress={() => callMobilePhone(item.phone)}>
            <Feather name="phone-call" size={24} color={Colors.primary} />
          </TouchableOpacity>
          {item.otp_status !== 'Invalid' && (
            <TouchableOpacity onPress={() => revokeValidity(item.id)}>
              <MaterialCommunityIcons name="account-cancel" size={24} color={Colors.primary} />
            </TouchableOpacity>
          )}
        </View>
      </View>
      {expandedVisitor === item.id && (
        <View style={styles.expandedInfo}>
          {item.otp && <JewaText>OTP: {item.otp}</JewaText>}
          <JewaText>Time In: {item.time_in || 'N/A'}</JewaText>
          <JewaText>Time Out: {item.time_out || 'N/A'}</JewaText>
          <JewaText>Mode of Entry: {item.mode_of_entry}</JewaText>
          {item.event_type && <JewaText>Event: {item.event_type}</JewaText>}
          {item.vehicle_number && <JewaText>Vehicle: {item.vehicle_number.toUpperCase()}</JewaText>}
        </View>
      )}
    </TouchableOpacity>
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
          style={styles.preAuthorizeButton}
          onPress={() => setIsModalVisible(true)}
        >
          <JewaText style={styles.preAuthorizeButtonText}>
            Pre-authorize visitors
          </JewaText>
        </TouchableOpacity>
      </View>
      <FlatList
        data={visitors}
        renderItem={renderVisitorItem}
        keyExtractor={item => item.id.toString()}
        ListEmptyComponent={<JewaText style={styles.emptyText}>No visitors found.</JewaText>}
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
    marginHorizontal: 16,
  },
  preAuthorizeButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  preAuthorizeButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Nunito_600SemiBold',
  },
  visitorItem: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 8,
    overflow: 'hidden',
  },
  visitorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  visitorInfo: {
    flex: 1,
  },
  visitorName: {
    fontSize: 18,
    fontFamily: 'Nunito_700Bold',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 70,
  },
  expandedInfo: {
    padding: 16,
    backgroundColor: Colors.lightGray,
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