import React, { useState, useRef } from 'react';
import { View, TouchableOpacity, StyleSheet, Animated, Modal, TextInput, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { Tabs } from 'expo-router';
import axios from 'axios';

import Colors from '~/constants/Colors';
import JewaText from '~/components/JewaText';
import CustomHeader from '~/components/CustomHeader';
import { TabBarIcon } from '~/components/TabBarIcon';
import { useUserStore } from '~/store/user-storage';
import { useNavigation } from '@react-navigation/native';

interface AlarmData {
  house_id: number;
  resident_id: number;
  community_code: string;
  subject: string;
  description: string;
  status: string;
}

const FloatingActionButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAlarmModalVisible, setIsAlarmModalVisible] = useState(false);
  const buttonAnimation = useRef(new Animated.Value(0)).current;
  const [loading, setLoading] = useState(false);
  const [alarmData, setAlarmData] = useState<AlarmData>({
    house_id: 0,
    resident_id: 0,
    community_code: '',
    subject: '',
    description: '',
    status: 'Pending',
  });

  const user = useUserStore(state => state.user);

  const toggleMenu = () => {
    Animated.timing(buttonAnimation, {
      toValue: isOpen ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
    setIsOpen(!isOpen);
  };

  const openAlarmModal = () => {
    setIsAlarmModalVisible(true);
    setIsOpen(false);
    setAlarmData({
      ...alarmData,
      house_id: 1,
      resident_id: user?.userid!
    });
  };

  const submitAlarm = async () => {
    setLoading(true);
    try {
      const response = await axios.post('https://jewapropertypro.com/infinity/api/addalert', alarmData);
      console.log('Alarm raised successfully:', response.data);
      setIsAlarmModalVisible(false);
      if (response.data.message === 'Alert has been sent') {
        Alert.alert('Success', 'Alarm raised successfully');
      }
    } catch (error) {
      console.error('Error raising alarm:', error);
    } finally {
      setLoading(false);
    }
  };

  const riseAlarmStyle = {
    transform: [
      { scale: buttonAnimation },
      {
        translateY: buttonAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -70],
        }),
      },
    ],
  };

  const authoriseVisitorStyle = {
    transform: [
      { scale: buttonAnimation },
      {
        translateY: buttonAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -130],
        }),
      },
    ],
  };

  const navigation = useNavigation();

  return (
    <>
      <View style={styles.fabContainer}>
        <Animated.View style={[styles.fabOption, riseAlarmStyle]}>
          <TouchableOpacity style={styles.fabOptionButton} onPress={openAlarmModal}>
            <Ionicons name="alert-circle-outline" size={24} color={Colors.primary} />
            <JewaText style={styles.fabOptionText}>Raise Alarm</JewaText>
          </TouchableOpacity>
        </Animated.View>
        <Animated.View style={[styles.fabOption, authoriseVisitorStyle]}>
          <TouchableOpacity style={styles.fabOptionButton} onPress={() => 
            navigation.navigate('two', { screen: 'Visitors' })
          }>
            <Ionicons name="person-add-outline" size={24} color={Colors.primary} />
            <JewaText style={styles.fabOptionText}>Authorise Visitor</JewaText>
          </TouchableOpacity>
        </Animated.View>
        <TouchableOpacity style={styles.fabButton} onPress={toggleMenu}>
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>
      <Modal
        visible={isAlarmModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsAlarmModalVisible(false)}
        style={{ flex: 1, width: '100%' }}
      >
        <View style={styles.modalContainer}>
          <ScrollView contentContainerStyle={styles.modalContent}>
            <JewaText style={styles.modalTitle}>Raise Alert to the Security guard</JewaText>
            <TextInput
              style={styles.input}
              placeholder="Subject"
              value={alarmData.subject}
              onChangeText={(text) => setAlarmData({ ...alarmData, subject: text })}
            />
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Description"
              multiline
              numberOfLines={4}
              value={alarmData.description}
              onChangeText={(text) => setAlarmData({ ...alarmData, description: text })}
            />
            <TouchableOpacity style={styles.submitButton} onPress={submitAlarm}>
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <JewaText style={styles.submitButtonText}>Submit</JewaText>
              )}
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={() => setIsAlarmModalVisible(false)}>
              <JewaText style={styles.cancelButtonText}>Cancel</JewaText>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
    </>
  );
};

export default function TabLayout() {
  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors.primary,
          tabBarBackground: () => (
            <BlurView
              intensity={100}
              tint={'light'}
              style={{
                flex: 1,
                backgroundColor: 'rgba(0,0,0,0.05)',
              }}
            />
          ),
          tabBarStyle: {
            backgroundColor: 'transparent',
            position: 'absolute',
            bottom: 15,
            left: 0,
            right: 0,
            elevation: 0,
            borderTopWidth: 0,
          },
          header: () => <CustomHeader />,
          headerTransparent: true,
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            headerShown: true,
            tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
            header: () => <CustomHeader />,
          }}
        />
        <Tabs.Screen
          name="two"
          options={{
            title: 'Community',
            tabBarIcon: ({ color }) => <Ionicons name="people" size={24} color={color} />,
          }}
        />
      </Tabs>
      <FloatingActionButton />
    </>
  );
}

const styles = StyleSheet.create({
  fabContainer: {
    position: 'absolute',
    bottom: 80,
    right: 20,
    alignItems: 'center',
  },
  fabButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  fabOption: {
    position: 'absolute',
    right: 0,
    backgroundColor: 'white',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: 'center',
    elevation: 4,
    width: 160,
  },
  fabOptionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  fabOptionText: {
    color: 'black',
    fontSize: 14,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    width: '100%',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
    width: '80%',
    maxWidth: 400,
    marginTop: 130,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.lightGray,
    borderRadius: 4,
    padding: 8,
    marginBottom: 12,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: Colors.primary,
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
    marginBottom: 8,
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  cancelButton: {
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  cancelButtonText: {
    color: Colors.primary,
    fontWeight: 'bold',
  },
});