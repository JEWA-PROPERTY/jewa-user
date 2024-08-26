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

function OTPVerification({ email: initialEmail, onVerificationSuccess, onBack }: any) {
    const [otp, setOtp] = useState('');
    const [email, setEmail] = useState(initialEmail || '');
    const [loading, setLoading] = useState(false);

    async function verifyOTP() {
        if (otp.length !== 5) {
            Alert.alert("Error", "Please enter a 5-character OTP");
            return;
        }

        if (!email) {
            Alert.alert("Error", "Please enter your email");
            return;
        }

        setLoading(true);

        const payload = {
            email: email,
            code: otp
        };

        try {
            const response = await fetch('https://jewapropertypro.com/infinity/api/emailcodeconfirmation', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            console.log('OTP Response', data);

            if (data.message === 'Correct code, Wait for your account to be activated by management') {
                Alert.alert("Success", "OTP verified successfully");
                onVerificationSuccess();
            } else {
                Alert.alert("", data.message || "OTP verification failed");
            }
        } catch (error) {
            console.error("OTP verification error:", error);
            Alert.alert("Error", "An error occurred during OTP verification");
        } finally {
            setLoading(false);
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={onBack} style={{ marginRight: 20 }}>
                    <Ionicons name="arrow-back-outline" size={24} color="#000" />
                </TouchableOpacity>
                <JewaText style={styles.header}>Verify Email</JewaText>
            </View>
            <JewaText style={styles.description}>
                Once you've been verified by management, you'll receive an OTP via email.
            </JewaText>
            {!initialEmail && (
                <View style={styles.inputContainer}>
                    <Ionicons name="mail-outline" size={24} color={Colors.gray} style={styles.icon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Enter your email"
                        placeholderTextColor={Colors.gray}
                        keyboardType="email-address"
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                    />
                </View>
            )}
            <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={24} color={Colors.gray} style={styles.icon} />
                <TextInput
                    style={styles.input}
                    placeholder="Enter 5-character OTP"
                    placeholderTextColor={Colors.gray}
                    maxLength={5}
                    value={otp}
                    onChangeText={setOtp}
                />
            </View>
            <TouchableOpacity
                style={[styles.button, (otp.length === 5 && email) ? styles.enabled : styles.disabled]}
                onPress={verifyOTP}
                disabled={loading || otp.length !== 5 || !email}>
                {loading ? <ActivityIndicator size="small" color={'white'} /> :
                    <JewaText style={styles.buttonText}>Verify OTP</JewaText>
                }
            </TouchableOpacity>
        </View>
    );
}

export default function Register() {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [fname, setFName] = useState('');
    const [lname, setLName] = useState('');
    const [code, setCode] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showOTPVerification, setShowOTPVerification] = useState(false);
    const keyboardVerticalOffset = Platform.OS === 'ios' ? 80 : 0;

    async function onRegisterPress() {
        if (password !== confirmPassword) {
            Alert.alert("Error", "Passwords do not match");
            return;
        }

        setLoading(true);

        const payload = {
            email: email,
            phone: phone,
            usertype_id: 1,
            password: password,
            fname: fname,
            lname: lname,
            code: code
        };

        try {
            const response = await fetch('https://jewapropertypro.com/infinity/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (data.message && data.message.email === "The email has already been taken.") {
                Alert.alert("Error", "User already exists");
                return;
            }

            if (data.code === '200') {
                Alert.alert("Success", "Registration successful. Please wait for approval");
                setShowOTPVerification(true);
            } else {
                Alert.alert("Error", data.message || "Registration failed");
            }
        } catch (error) {
            console.error("Registration error:", error);
            Alert.alert("Error", "An error occurred during registration");
        } finally {
            setLoading(false);
        }
    }

    function handleVerificationSuccess() {
        Alert.alert(
            "Verification Successful",
            "Your account has been verified. Please log in.",
            [
                { text: "OK", onPress: () => router.push('/login') }
            ]
        );
    }

    if (showOTPVerification) {
        return <OTPVerification 
            email={email} 
            onVerificationSuccess={handleVerificationSuccess} 
            onBack={() => setShowOTPVerification(false)}
        />;
    }

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={keyboardVerticalOffset}>
            <ScrollView style={styles.container}>
                <View style={styles.headerContainer}>
                    <TouchableOpacity onPress={() => router.push('/login')} style={{ marginRight: 20, marginTop: 30 }}>
                        <Ionicons name="arrow-back-outline" size={24} color="#000" />
                    </TouchableOpacity>
                    <JewaText style={styles.header}>Create an Account</JewaText>
                </View>
                <JewaText style={styles.description}>
                    Enter your details to register
                </JewaText>
                <View style={styles.inputContainer}>
                    <Ionicons name="person-outline" size={24} color={Colors.gray} style={styles.icon} />
                    <TextInput
                        style={styles.input}
                        placeholder="First Name"
                        placeholderTextColor={Colors.gray}
                        value={fname}
                        onChangeText={setFName}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Ionicons name="person-outline" size={24} color={Colors.gray} style={styles.icon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Last Name"
                        placeholderTextColor={Colors.gray}
                        value={lname}
                        onChangeText={setLName}
                    />
                </View>
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
                <View style={styles.inputContainer}>
                    <Ionicons name="call-outline" size={24} color={Colors.gray} style={styles.icon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Phone"
                        placeholderTextColor={Colors.gray}
                        keyboardType="phone-pad"
                        value={phone}
                        onChangeText={setPhone}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Ionicons name="business-outline" size={24} color={Colors.gray} style={styles.icon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Community Code"
                        placeholderTextColor={Colors.gray}
                        value={code}
                        onChangeText={setCode}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Ionicons name="lock-closed-outline" size={24} color={Colors.gray} style={styles.icon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        placeholderTextColor={Colors.gray}
                        secureTextEntry={!showPassword}
                        value={password}
                        onChangeText={setPassword}
                    />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                        <Ionicons name={showPassword ? "eye-outline" : "eye-off-outline"} size={24} color={Colors.gray} />
                    </TouchableOpacity>
                </View>
                <View style={styles.inputContainer}>
                    <Ionicons name="lock-closed-outline" size={24} color={Colors.gray} style={styles.icon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Confirm Password"
                        placeholderTextColor={Colors.gray}
                        secureTextEntry={!showConfirmPassword}
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                    />
                    <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeIcon}>
                        <Ionicons name={showConfirmPassword ? "eye-outline" : "eye-off-outline"} size={24} color={Colors.gray} />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity
                    style={[
                        styles.button,
                        (email !== '' && phone !== '' && password !== '' && confirmPassword !== '') ? styles.enabled : styles.disabled,
                    ]}
                    onPress={onRegisterPress}
                    disabled={loading || email === '' || phone === '' || password === '' || confirmPassword === ''}>
                    {loading ? <ActivityIndicator size="small" color={'white'} /> :
                        <JewaText style={styles.buttonText}>Register</JewaText>
                    }
                </TouchableOpacity>
                <TouchableOpacity style={styles.loginLink} onPress={() => router.push('/login')}>
                    <JewaText style={styles.linkText}>Already have an account? Sign In</JewaText>
                </TouchableOpacity>
                <TouchableOpacity style={styles.verifyLink} onPress={() => setShowOTPVerification(true)}>
                    <JewaText style={styles.linkText}>Verify Code</JewaText>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 30
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    header: {
        fontSize: 24,
        fontFamily: 'Nunito_700Bold',
        marginBottom: 10,
        marginTop: 40,
        width: '100%',
    },
    description: {
        fontSize: 16,
        color: 'black',
        marginBottom: 20,
        marginTop: 40,
        fontFamily: 'Nunito_700Bold',
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
    eyeIcon: {
        padding: 10,
    },
    input: {
        flex: 1,
        fontSize: 12,
        fontFamily: 'Nunito_400Regular',
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
    verifyLink: {
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 40,
    },
    linkText: {
        color: 'black',
        fontSize: 14,
    },
});