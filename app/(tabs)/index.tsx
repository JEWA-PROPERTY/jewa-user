import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useHeaderHeight } from '@react-navigation/elements';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '~/constants/Colors';
import { defaultStyles } from '~/constants/Styles';

const Tab = createMaterialTopTabNavigator();

function ActivityScreen() {
  const headerHeight = useHeaderHeight();
  const pendingDeliveries = 3;
  const activeVisitorPasses = 5;
  const domesticHelpCount = 2;
  const residentName = 'John Doe';
  const houseNumber = 'F-62';

  return (
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
  );
}

function HouseholdScreen() {
  return (
    <View style={styles.tabContent}>
      <Text>Household Content</Text>
    </View>
  );
}

function CommunityScreen() {
  return (
    <View style={styles.tabContent}>
      <Text>Community Content</Text>
    </View>
  );
}

export default function HomeTab() {
  return (
    <SafeAreaView style={styles.container}>
      <Tab.Navigator screenOptions={
        {
          tabBarLabelStyle: { fontSize: 14, fontWeight: 'bold' },
          tabBarIndicatorStyle: { backgroundColor: Colors.primary },
          tabBarStyle: { backgroundColor: 'white' },
          tabBarBounces: false,
          tabBarScrollEnabled: false,
          tabBarItemStyle: { width: 'auto', paddingHorizontal: 16, marginLeft: 20, marginRight: 0},
        }
      }
      >
        <Tab.Screen name="Activity" component={ActivityScreen} />
        <Tab.Screen name="Household" component={HouseholdScreen} />
        <Tab.Screen name="Community" component={CommunityScreen} />
      </Tab.Navigator>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    marginTop: 80,
  },
  tabContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subText: {
    fontSize: 16,
    color: '#666',
  },
  quickActions: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    backgroundColor: Colors.primary,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
  },
  actionButtonText: {
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
    fontWeight: 'bold',
    marginTop: 8,
  },
  summaryCount: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 4,
  },
  summarySubtext: {
    fontSize: 12,
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
    fontWeight: 'bold',
  },
  updateSubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
});