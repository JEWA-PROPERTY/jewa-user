import { Link, Tabs } from 'expo-router';
import { HeaderButton } from '../../components/HeaderButton';
import { TabBarIcon } from '../../components/TabBarIcon';
import Colors from '~/constants/Colors';
import React, { useState, useRef } from 'react';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import CustomHeader from '~/components/CustomHeader';
import { View, TouchableOpacity, StyleSheet, Animated, Text } from 'react-native';

const FloatingActionButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const buttonAnimation = useRef(new Animated.Value(0)).current;

  const toggleMenu = () => {
    Animated.timing(buttonAnimation, {
      toValue: isOpen ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
    setIsOpen(!isOpen);
  };

  const riseAlarmStyle = {
    transform: [
      { scale: buttonAnimation },
      {
        translateY: buttonAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 0],
        }),
      },
      {
        translateX: buttonAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 0], 
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
          outputRange: [0, 0],
        }),
      },
      {
        translateX: buttonAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 0], 
        }),
      },
    ],
  };

  return (
    <View style={styles.fabContainer}>
      <Animated.View style={[styles.fabOption, styles.fabOptionTop, riseAlarmStyle]}>
        <TouchableOpacity style={styles.fabOptionButton} onPress={() => console.log('Rise Alarm')}>
          <Ionicons name="alert-circle-outline" size={24} color={Colors.primary} />
          <Text style={styles.fabOptionText}>Rise Alarm</Text>
        </TouchableOpacity>
      </Animated.View>
      <Animated.View style={[styles.fabOption, styles.fabOptionBottom, authoriseVisitorStyle]}>
        <TouchableOpacity style={styles.fabOptionButton} onPress={() => console.log('Authorise Visitor')}>
          <Ionicons name="person-add-outline" size={24} color={Colors.primary} />
          <Text style={styles.fabOptionText}>Authorise Visitor</Text>
        </TouchableOpacity>
      </Animated.View>
      <TouchableOpacity style={styles.fabButton} onPress={toggleMenu}>
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>
    </View>
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
  fabOptionTop: {
    top: -70,
  },
  fabOptionBottom: {
    top: -130,
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
});
