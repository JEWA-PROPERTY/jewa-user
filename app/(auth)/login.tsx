import { Link } from 'expo-router';
import React, { useState } from 'react'
import { View, Text, Input, StyleSheet, Platform, KeyboardAvoidingView, ActivityIndicator, TouchableOpacity, TextInput } from 'react-native'
import Colors from '~/constants/Colors';
import { defaultStyles } from '~/constants/Styles';

export default function Login() {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const keyboardVerticalOffset = Platform.OS === 'ios' ? 80 : 0;

    async function onSignInPress() {
        console.log("Sign in pressed");
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
                    onPress={() => {
                        onSignInPress();
                    }}>
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