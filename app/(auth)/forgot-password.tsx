import React, { useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    View,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    ScrollView
} from "react-native";
import { Ionicons } from '@expo/vector-icons';
import Colors from "~/constants/Colors";
import { router } from "expo-router";
import JewaText from '~/components/JewaText';

const CodeConfirmation = ({ email, onCodeConfirmed }: any) => {
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);

    const onConfirmCode = async () => {
        if (!code) {
            Alert.alert("Error", "Please enter the code sent to your email");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('https://jewapropertypro.com/infinity/api/resetpwdcodeconfirmation', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, code })
            });

            const data = await response.json();

            if (data.message === 'Correct code') {
                onCodeConfirmed();
            } else {
                Alert.alert("Error", data.message || "Failed to confirm code");
            }
        } catch (error) {
            console.error("Code confirmation error:", error);
            Alert.alert("Error", "An error occurred while confirming the code");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View>
            <JewaText style={styles.header}>Enter Confirmation Code</JewaText>
            <JewaText style={styles.description}>
                Enter the code sent to your email address.
            </JewaText>
            <View style={styles.inputContainer}>
                <Ionicons name="key-outline" size={24} color={Colors.gray} style={styles.icon} />
                <TextInput
                    style={styles.input}
                    placeholder="Confirmation Code"
                    placeholderTextColor={Colors.gray}
                    value={code}
                    onChangeText={setCode}
                />
            </View>
            <TouchableOpacity
                style={[styles.button, code !== '' ? styles.enabled : styles.disabled]}
                onPress={onConfirmCode}
                disabled={loading || code === ''}>
                {loading ? <ActivityIndicator size="small" color={'white'} /> :
                    <JewaText style={styles.buttonText}>Confirm Code</JewaText>
                }
            </TouchableOpacity>
        </View>
    );
};

const NewPasswordEntry = ({ email, onPasswordUpdated }: any) => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const onUpdatePassword = async () => {
        if (password !== confirmPassword) {
            Alert.alert("Error", "Passwords do not match");
            return;
        }

        setLoading(true);

        try {
           console.log('email', email);
            const userDetailsResponse = await fetch('https://jewapropertypro.com/infinity/api/getuserdetails', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email })
            });

            const userDetailsData = await userDetailsResponse.json();

            if (userDetailsData.length === 0) {
                throw new Error(userDetailsData.message || "Failed to get user details");
            }

            const userId = userDetailsData[0].userid;

            console.log('userId', userId);

            const updatePasswordResponse = await fetch('https://jewapropertypro.com/infinity/api/updatepassword', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    userid: userId,
                    password: password,
                    password_confirmation: confirmPassword
                })
            });

            const updatePasswordData = await updatePasswordResponse.json();

            if (updatePasswordData.message === 'Password changed successfully') {
                onPasswordUpdated();
            } else {
                Alert.alert("Error", updatePasswordData.message || "Failed to update password");
            }
        } catch (error) {
            console.error("Password update error:", error);
            Alert.alert("Error", "An error occurred while updating the password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View>
            <JewaText style={styles.header}>Set New Password</JewaText>
            <JewaText style={styles.description}>
                Enter and confirm your new password.
            </JewaText>
            <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={24} color={Colors.gray} style={styles.icon} />
                <TextInput
                    style={styles.input}
                    placeholder="New Password"
                    placeholderTextColor={Colors.gray}
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                />
            </View>
            <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={24} color={Colors.gray} style={styles.icon} />
                <TextInput
                    style={styles.input}
                    placeholder="Confirm New Password"
                    placeholderTextColor={Colors.gray}
                    secureTextEntry
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                />
            </View>
            <TouchableOpacity
                style={[styles.button, (password !== '' && confirmPassword !== '') ? styles.enabled : styles.disabled]}
                onPress={onUpdatePassword}
                disabled={loading || password === '' || confirmPassword === ''}>
                {loading ? <ActivityIndicator size="small" color={'white'} /> :
                    <JewaText style={styles.buttonText}>Update Password</JewaText>
                }
            </TouchableOpacity>
        </View>
    );
};

export default function ForgotPassword() {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [stage, setStage] = useState('email');
    const keyboardVerticalOffset = Platform.OS === 'ios' ? 80 : 0;

    async function onResetPress() {
        if (!email) {
            Alert.alert("Error", "Please enter your email address");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('https://jewapropertypro.com/infinity/api/resetpassword', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email })
            });

            const data = await response.json();

            console.log('data', data);

            if (data.message === 'Password Reset email has been sent') {
                setStage('code');
            } else {
                Alert.alert("Error", data.message || "Failed to send reset instructions");
            }
        } catch (error) {
            console.error("Password reset error:", error);
            Alert.alert("Error", "An error occurred while processing your request");
        } finally {
            setLoading(false);
        }
    }

    const onCodeConfirmed = () => {
        setStage('newPassword');
    };

    const onPasswordUpdated = () => {
        Alert.alert(
            "Success",
            "Your password has been updated successfully.",
            [{ text: "OK", onPress: () => router.push('/login') }]
        );
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={keyboardVerticalOffset}>
            <ScrollView style={styles.container}>
                {stage === 'email' && (
                    <>
                        <JewaText style={styles.header}>Forgot Password</JewaText>
                        <JewaText style={styles.description}>
                            Enter your email address and we'll send you instructions to reset your password.
                        </JewaText>
                        <View style={styles.inputContainer}>
                            <Ionicons name="mail-outline" size={24} color={Colors.gray} style={styles.icon} />
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
                        <TouchableOpacity
                            style={[
                                styles.button,
                                email !== '' ? styles.enabled : styles.disabled,
                            ]}
                            onPress={onResetPress}
                            disabled={loading || email === ''}>
                            {loading ? <ActivityIndicator size="small" color={'white'} /> :
                                <JewaText style={styles.buttonText}>Reset Password</JewaText>
                            }
                        </TouchableOpacity>
                    </>
                )}
                {stage === 'code' && (
                    <CodeConfirmation email={email} onCodeConfirmed={onCodeConfirmed} />
                )}
                {stage === 'newPassword' && (
                    <NewPasswordEntry email={email} onPasswordUpdated={onPasswordUpdated} />
                )}
                <TouchableOpacity style={styles.loginLink} onPress={() => router.push('/login')}>
                    <JewaText style={styles.linkText}>Back to Login</JewaText>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        marginTop: 40,
    },
    description: {
        fontSize: 16,
        color: Colors.gray,
        marginBottom: 20,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: Colors.lightGray,
        marginBottom: 20,
    },
    icon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        fontSize: 16,
        paddingVertical: 10,
    },
    button: {
        backgroundColor: Colors.primary,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    enabled: {
        opacity: 1,
    },
    disabled: {
        opacity: 0.5,
    },
    loginLink: {
        alignItems: 'center',
        marginTop: 20,
    },
    linkText: {
        color: Colors.primary,
        fontSize: 14,
    },
});