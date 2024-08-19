import { StyleSheet, View, ScrollView, TouchableOpacity, SafeAreaView, FlatList } from 'react-native';
import { useHeaderHeight } from '@react-navigation/elements';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '~/constants/Colors';
import { useUserStore } from '~/store/user-storage';
import JewaText from '~/components/JewaText';
import { useEffect, useState } from 'react';

export default function HomeTab() {
  const headerHeight = useHeaderHeight();
  const { user } = useUserStore();
  const [pendingActions, setPendingActions] = useState([]);
  const [pendingNotifications, setPendingNotifications] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [communityUpdates, setCommunityUpdates] = useState([]);

  const residentName = user?.fullname || 'Resident';
  const houseNumber = 'F-62';
  // console.log('user', alerts.length, pendingActions.length, pendingNotifications.length);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://jewapropertypro.com/infinity/api/residentdashboard', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ resident_id: user?.userid }),
        });
        const data = await response.json();
        setPendingActions(data.pendingactions || []);
        setPendingNotifications(data.pendingnotification || [])
        setCommunityUpdates(data.communityupdates || []);
        setAlerts(data.alert || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={{ backgroundColor: Colors.background }}
        contentContainerStyle={{ paddingTop: headerHeight, flexGrow: 1, paddingBottom: 50 }}
      >
        <View style={styles.header}>
          <View>
            <JewaText style={styles.welcomeJewaText}>Welcome, {residentName}</JewaText>
            <JewaText style={styles.subJewaText}>House: {houseNumber}</JewaText>
          </View>
        </View>

        <View style={styles.quickActions}>
          <JewaText style={styles.sectionTitle}>Quick Actions</JewaText>
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionButton} onPress={() => router.push('/(tabs)/two')}>
              <Ionicons name="person-add-outline" size={24} color="white" />
              <JewaText style={styles.actionButtonJewaText}>Pre-authorize Visitor</JewaText>
            </TouchableOpacity>
            {/* <TouchableOpacity style={styles.actionButton} onPress={() => router.push('/management')}>
              <Ionicons name="people-outline" size={24} color="white" />
              <JewaText style={styles.actionButtonJewaText}></JewaText>
            </TouchableOpacity> */}
            <TouchableOpacity style={styles.actionButton} onPress={() => router.push('/(tabs)/two')}>
              <Ionicons name="warning-outline" size={24} color="white" />
              <JewaText style={styles.actionButtonJewaText}>Report Issue</JewaText>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.summaries}>
          <TouchableOpacity style={styles.summaryCard} onPress={() => router.push('/(tabs)/two')}>
            <Ionicons name="cube-outline" size={36} color="#007AFF" />
            <JewaText style={styles.summaryTitle}>Deliveries</JewaText>
            <JewaText style={styles.summaryCount}>{pendingActions.length}</JewaText>
            <JewaText style={styles.summarySubJewaText}>At the gate</JewaText>
          </TouchableOpacity>

          <TouchableOpacity style={styles.summaryCard} onPress={() => router.push('/(tabs)/two')}>
            <Ionicons name="notifications" size={36} color="#FF9500" />
            <JewaText style={styles.summaryTitle}>Notifications</JewaText>
            <JewaText style={styles.summaryCount}>{pendingNotifications.length}</JewaText>
            <JewaText style={styles.summarySubJewaText}>Pending</JewaText>
          </TouchableOpacity>

          <TouchableOpacity style={styles.summaryCard} onPress={() => router.push('/(tabs)/two')}>
            <Ionicons name="alert" size={36} color="#5856D6" />
            <JewaText style={styles.summaryTitle}>Alerts</JewaText>
            <JewaText style={styles.summaryCount}>{alerts.length}</JewaText>
            <JewaText style={styles.summarySubJewaText}>Registered</JewaText>
          </TouchableOpacity>
        </View>

        <View style={styles.communitySection}>
          <JewaText style={styles.sectionTitle}>Community Updates</JewaText>
          <FlatList
            data={communityUpdates}
            ListEmptyComponent={
              <View style={styles.updateItem}>
                <JewaText>No updates available</JewaText>
              </View>
            }
            keyExtractor={(item: any) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.updateItem}>
                <JewaText style={styles.updateTitle}>{item.subject}</JewaText>
                <JewaText style={styles.updateSubJewaText}>{item.description}</JewaText>
              </View>
            )}
          />
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

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
  welcomeJewaText: {
    fontSize: 24,
    fontFamily: 'Nunito_700Bold',
  },
  subJewaText: {
    fontSize: 16,
    fontFamily: 'Nunito_400Regular',
    color: '#666',
  },
  quickActions: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Nunito_600SemiBold',
    marginBottom: 12,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    backgroundColor: 'black',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
  },
  actionButtonJewaText: {
    fontSize: 14,
    fontFamily: 'Nunito_500Medium',
    color: 'white',
    marginTop: 4,
    textAlign: 'center',
  },
  summaries: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  summaryCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  summaryTitle: {
    fontSize: 12,
    fontFamily: 'Nunito_600SemiBold',
    marginTop: 8,
  },
  summaryCount: {
    fontSize: 24,
    fontFamily: 'Nunito_700Bold',
    marginTop: 4,
  },
  summarySubJewaText: {
    fontSize: 12,
    fontFamily: 'Nunito_400Regular',
    color: '#666',
  },
  communitySection: {
    padding: 16,
  },
  updateItem: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  updateTitle: {
    fontSize: 16,
    fontFamily: 'Nunito_600SemiBold',
  },
  updateSubJewaText: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    color: '#666',
    marginTop: 4,
  },
});
