import {
    KeyboardAvoidingView,
    Platform,
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    ScrollView
} from "react-native";
import { useState } from "react";
import { defaultStyles } from "~/constants/Styles";
import Colors from "~/constants/Colors";
import { router } from "expo-router";

function OTPVerification({ email, onVerificationSuccess }: any) {
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);

    async function verifyOTP() {
        if (otp.length !== 5) {
            Alert.alert("Error", "Please enter a 5-character OTP");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('https://jewapropertypro.com/infinity/api/emailcodeconfirmation', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, otp })
            });

            const data = await response.json();

            if (response.ok) {
                Alert.alert("Success", "OTP verified successfully");
                onVerificationSuccess();
            } else {
                Alert.alert("Error", data.message || "OTP verification failed");
            }
        } catch (error) {
            console.error("OTP verification error:", error);
            Alert.alert("Error", "An error occurred during OTP verification");
        } finally {
            setLoading(false);
        }
    }

    return (
        <View style={styles.otpContainer}>
            <Text style={defaultStyles.header}>Verify Email</Text>
            <Text style={defaultStyles.descriptionJewaText}>
                Once you've been verified by management, you'll receive an OTP via email.
            </Text>
            <View style={styles.inputContainer}>
                <TextInput
                    style={[styles.input, { flex: 1 }]}
                    placeholder="Enter 5-character OTP"
                    placeholderTextColor={Colors.gray}
                    keyboardType="email-address"
                    maxLength={5}
                    value={otp}
                    onChangeText={setOtp}
                />
            </View>
            <TouchableOpacity
                style={[
                    defaultStyles.pillButton,
                    otp.length === 5 ? styles.enabled : styles.disabled,
                ]}
                onPress={verifyOTP}
                disabled={loading}>
                {loading ? <ActivityIndicator size="small" color={'white'} /> :
                    <Text style={defaultStyles.buttonJewaText}>Verify OTP</Text>
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

            if (response.ok) {
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
        return <OTPVerification email={email} onVerificationSuccess={handleVerificationSuccess} />;
    }

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior="padding"
            keyboardVerticalOffset={keyboardVerticalOffset}>
            <ScrollView style={defaultStyles.container} className="mt-9">
                <Text style={defaultStyles.header}>Create an Account</Text>
                <Text style={defaultStyles.descriptionJewaText}>
                    Enter your email, phone, and password to register
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
                        placeholder="First Name"
                        placeholderTextColor={Colors.gray}
                        keyboardType="email-address"
                        value={fname}
                        onChangeText={setFName}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={[styles.input, { flex: 1 }]}
                        placeholder="Last Name"
                        placeholderTextColor={Colors.gray}
                        keyboardType="email-address"
                        value={lname}
                        onChangeText={setLName}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <TextInput
                        style={[styles.input, { flex: 1 }]}
                        placeholder="Community Code"
                        placeholderTextColor={Colors.gray}
                        keyboardType="email-address"
                        value={code}
                        onChangeText={setCode}
                    />
                </View>
         
                <View style={styles.inputContainer}>
                    <TextInput
                        style={[styles.input, { flex: 1 }]}
                        placeholder="Phone"
                        placeholderTextColor={Colors.gray}
                        keyboardType="numeric"
                        value={phone}
                        onChangeText={setPhone}
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
                <View style={styles.inputContainer}>
                    <TextInput
                        style={[styles.input, { flex: 1 }]}
                        placeholder="Confirm Password"
                        placeholderTextColor={Colors.gray}
                        secureTextEntry
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                    />
                </View>
                <TouchableOpacity
                    style={[
                        defaultStyles.pillButton,
                        (email !== '' && phone !== '' && password !== '' && confirmPassword !== '') ? styles.enabled : styles.disabled,
                        { marginBottom: 20 },
                    ]}
                    onPress={onRegisterPress}
                    disabled={loading || email === '' || phone === '' || password === '' || confirmPassword === ''}>
                    {loading ? <ActivityIndicator size="small" color={'white'} /> :
                        <Text style={defaultStyles.buttonJewaText}>Register</Text>
                    }
                </TouchableOpacity>
            </ScrollView>
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
    otpContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
});