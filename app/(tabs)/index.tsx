import { StyleSheet, View, Text, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { useHeaderHeight } from '@react-navigation/elements';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '~/constants/Colors';

export default function HomeTab() {
  const headerHeight = useHeaderHeight();

  const pendingDeliveries = 3;
  const activeVisitorPasses = 5;
  const domesticHelpCount = 2;
  const residentName = 'John Doe';
  const houseNumber = 'F-62';
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={{ backgroundColor: Colors.background }}
        contentContainerStyle={{ paddingTop: headerHeight, flexGrow: 1, paddingBottom: 50 }}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.welcomeText}>Welcome, {residentName}</Text>
            <Text style={styles.subText}>House: {houseNumber}</Text>
          </View>
        </View>

        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionButton} onPress={() => router.push('/visitors')}>
              <Ionicons name="person-add-outline" size={24} color="white" />
              <Text style={styles.actionButtonText}>Visitor</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={() => router.push('/management')}>
              <Ionicons name="people-outline" size={24} color="white" />
              <Text style={styles.actionButtonText}>Manage Help</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={() => router.push('/')}>
              <Ionicons name="warning-outline" size={24} color="white" />
              <Text style={styles.actionButtonText}>Report Issue</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.summaries}>
          <TouchableOpacity style={styles.summaryCard} onPress={() => router.push('/')}>
            <Ionicons name="cube-outline" size={36} color="#007AFF" />
            <Text style={styles.summaryTitle}>Deliveries</Text>
            <Text style={styles.summaryCount}>{pendingDeliveries}</Text>
            <Text style={styles.summarySubtext}>Pending</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.summaryCard} onPress={() => router.push('/')}>
            <Ionicons name="people-outline" size={36} color="#FF9500" />
            <Text style={styles.summaryTitle}>Visitors</Text>
            <Text style={styles.summaryCount}>{activeVisitorPasses}</Text>
            <Text style={styles.summarySubtext}>Active Passes</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.summaryCard} onPress={() => router.push('/')}>
            <Ionicons name="home-outline" size={36} color="#5856D6" />
            <Text style={styles.summaryTitle}>Domestic Help</Text>
            <Text style={styles.summaryCount}>{domesticHelpCount}</Text>
            <Text style={styles.summarySubtext}>Registered</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.communitySection}>
          <Text style={styles.sectionTitle}>Community Updates</Text>
          <TouchableOpacity style={styles.updateItem} onPress={() => router.push('/')}>
            <Text style={styles.updateTitle}>Monthly Meeting</Text>
            <Text style={styles.updateSubtext}>Scheduled for next Sunday at 10 AM</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.updateItem} onPress={() => router.push('/')}>
            <Text style={styles.updateTitle}>New Gym Equipment</Text>
            <Text style={styles.updateSubtext}>Installation completed yesterday</Text>
          </TouchableOpacity>
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
  welcomeText: {
    fontSize: 24,
    fontFamily: 'Nunito_700Bold',
  },
  subText: {
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
  actionButtonText: {
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
    fontSize: 16,
    fontFamily: 'Nunito_600SemiBold',
    marginTop: 8,
  },
  summaryCount: {
    fontSize: 24,
    fontFamily: 'Nunito_700Bold',
    marginTop: 4,
  },
  summarySubtext: {
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
  updateSubtext: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    color: '#666',
    marginTop: 4,
  },
});
