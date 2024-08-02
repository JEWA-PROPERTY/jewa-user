import {
    KeyboardAvoidingView,
    Platform,
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    Alert
} from "react-native";
import { useState } from "react";
import { defaultStyles } from "~/constants/Styles";
import Colors from "~/constants/Colors";
import { Redirect, router } from "expo-router";

export default function Register() {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [phone, setPhone] = useState('');
    const keyboardVerticalOffset = Platform.OS === 'ios' ? 80 : 0;

    async function onRegisterPress() {
        // if (password !== confirmPassword) {
        //     Alert.alert("Error", "Passwords do not match");
        //     return;
        // }
        // Placeholder function for registration logic
        router.push('/(tabs)')
    }

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior="padding"
            keyboardVerticalOffset={keyboardVerticalOffset}>
            <View style={defaultStyles.container} className="mt-9">
                <Text style={defaultStyles.header}>Create an Account</Text>
                <Text style={defaultStyles.descriptionText}>
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
                    onPress={() => {
                        onRegisterPress();
                    }}>
                    {loading ? <ActivityIndicator size="small" color={'white'} /> :
                        <Text style={defaultStyles.buttonText}>Register</Text>
                    }
                </TouchableOpacity>
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
