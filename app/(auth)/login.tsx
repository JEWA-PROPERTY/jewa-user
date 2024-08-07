import { Link, Redirect, router } from 'expo-router';
import React, { useState } from 'react'
import { View, Text, Input, StyleSheet, Platform, KeyboardAvoidingView, ActivityIndicator, TouchableOpacity, TextInput } from 'react-native'
import Colors from '~/constants/Colors';
import { defaultStyles } from '~/constants/Styles';
import { useUserStore } from '~/store/user-storage';

export default function Login() {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const keyboardVerticalOffset = Platform.OS === 'ios' ? 80 : 0;
    const setUser = useUserStore((state) => state.setUser);
    const { user } = useUserStore();

    if (user) {
        console.log('User:', user);
        return <Redirect href="/(tabs)" />
    }

    async function onSignInPress() {
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

            if (!response.ok) {
                throw new Error('Login failed');
            }

            const data = await response.json();
            setUser({ email, token: data.token });
            router.replace('/(tabs)');
        } catch (error) {
            // console.error('Login error:', error.message);
            router.replace('/(tabs)');
        } finally {
            setLoading(false);
        }
    }
    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior='padding'
            keyboardVerticalOffset={keyboardVerticalOffset}
            className="mt-9" >
            <View style={defaultStyles.container} className="mt-32">
                <Text style={defaultStyles.header}>Welcome back!</Text>
                <Text style={defaultStyles.descriptionText}>
                    Enter your email and password to sign in
                </Text>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={[styles.input, { flex: 1 }]}
                        placeholder="Email"
                        placeholderTextColor={Colors.gray}
                        keyboardType="email-address"
                        value={email}
                        onChangeText={setEmail}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={[styles.input, { flex: 1 }]}
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
                        (email !== '' && password !== '') ? styles.enabled : styles.disabled,
                        { marginBottom: 20 },
                    ]}
                    onPress={onSignInPress}
                    disabled={loading || email === '' || password === ''}>
                    {loading ? <ActivityIndicator size="small" color={'white'} /> :
                        <Text style={defaultStyles.buttonText}>Continue</Text>
                    }
                </TouchableOpacity>
                <Link href={'/(auth)/register'} style={{ alignItems: 'center' }}>
                    <Text style={defaultStyles.textLink}>Don't have an account? Register</Text>
                </Link>
            </View>

        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    inputContainer: {
        marginVertical: 20,
        flexDirection: 'row',
    },
    input: {
        backgroundColor: Colors.lightGray,
        padding: 20,
        borderRadius: 16,
        fontSize: 20,
        marginRight: 10,
    },
    enabled: {
        backgroundColor: Colors.primary,
    },
    disabled: {
        backgroundColor: Colors.gray,
    },
});