// Login.tsx
import React, { useState, useEffect } from 'react';
import { router, Link } from 'expo-router';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import Colors from '~/constants/Colors';
import { defaultStyles } from '~/constants/Styles';
import { useUserStore, UserDetails } from '~/store/user-storage';

interface LoginResponse {
  message: string;
  userdetails: UserDetails[];
}

export default function Login(): JSX.Element {
  const [loading, setLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const keyboardVerticalOffset: number = Platform.OS === 'ios' ? 80 : 0;
  const { user, setUser } = useUserStore();

  useEffect(() => {
    // Check if user is already logged in
    if (user) {
      router.replace('/(tabs)');
    }
  }, [user]);

  const onSignInPress = async (): Promise<void> => {
    setLoading(true);
    try {
      const response = await fetch('https://jewapropertypro.com/infinity/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data: LoginResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      if (data.userdetails && data.userdetails.length > 0) {
        setUser(data.userdetails[0]);
        Alert.alert('Success', 'Login successful');
        router.replace('/(tabs)');
      } else {
        throw new Error('User details not found in the response');
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Login Failed', error instanceof Error ? error.message : 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={keyboardVerticalOffset}
    >
      <View style={[defaultStyles.container, styles.container]}>
        <Text style={styles.header}>Welcome back!</Text>
        <Text style={defaultStyles.descriptionText}>
          Enter your email and password to sign in
        </Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor={Colors.gray}
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
          />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor={Colors.gray}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>
        <TouchableOpacity
          style={[
            defaultStyles.pillButton,
            styles.button,
            (email !== '' && password !== '') ? styles.enabled : styles.disabled,
          ]}
          onPress={onSignInPress}
          disabled={loading || email === '' || password === ''}
        >
          {loading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text style={defaultStyles.buttonText}>Continue</Text>
          )}
        </TouchableOpacity>
        <Link href="/(auth)/register" asChild>
          <TouchableOpacity style={styles.registerLink}>
            <Text style={defaultStyles.textLink}>Don't have an account? Register</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 100,
  },
  header: {
    fontSize: 40,
    fontFamily: 'Nunito_700Bold',
    textTransform: 'uppercase',
    marginBottom: 20,
  },
  inputContainer: {
    marginVertical: 10,
  },
  input: {
    backgroundColor: Colors.lightGray,
    padding: 20,
    borderRadius: 16,
    fontSize: 20,
  },
  button: {
    marginVertical: 20,
  },
  enabled: {
    backgroundColor: Colors.primary,
  },
  disabled: {
    backgroundColor: Colors.gray,
  },
  registerLink: {
    alignItems: 'center',
    marginTop: 10,
  },
});