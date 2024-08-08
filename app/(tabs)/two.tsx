import { StyleSheet, View, Text, SafeAreaView } from 'react-native';
import ComingSoon from '~/components/ComingSoon';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Colors from '~/constants/Colors';

const Tab = createMaterialTopTabNavigator();

function ActivityScreen() {
  return (
    <View style={styles.tabContent}>
      <ComingSoon />
    </View>
  );
}

function HouseholdScreen() {
  return (
    <View style={styles.tabContent}>
      <ComingSoon />
    </View>
  );
}

function CommunityScreen() {
  return (
    <View style={styles.tabContent}>
      <ComingSoon />
    </View>
  );
}

export default function Home() {
  return (
    <SafeAreaView style={styles.container}>
      <Tab.Navigator
        screenOptions={{
          tabBarLabelStyle: { fontSize: 14, fontWeight: 'bold' },
          tabBarIndicatorStyle: { backgroundColor: Colors.primary },
          tabBarStyle: { backgroundColor: 'white' },
          tabBarBounces: false,
          tabBarScrollEnabled: false, 
          tabBarContentContainerStyle: { justifyContent: 'center' },
        }}
        style={{
           backgroundColor: 'white',
          

         }}
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
    marginTop: 80
  },
  tabContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});