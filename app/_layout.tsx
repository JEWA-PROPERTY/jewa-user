import { BlurView } from 'expo-blur';
import '../global.css';

import { Link, Stack, router } from 'expo-router';
import { TouchableOpacity, Text, View } from 'react-native';
import { defaultStyles } from '~/constants/Styles';
import Colors from '~/constants/Colors';
import { Ionicons } from '@expo/vector-icons';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

export default function RootLayout() {
  const top = 20;
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)/login" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)/register" options={{ headerShown: false }} />
      <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
      <Stack.Screen name="deliveries" options={{ headerShown: false }} />
      <Stack.Screen name="visitors" options={{ headerShown: false }} />
      <Stack.Screen name="management" options={{ headerShown: false }} />
    </Stack>
  );
}
