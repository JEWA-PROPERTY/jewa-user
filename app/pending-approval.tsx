import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Platform, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '~/constants/Colors';
import { router } from 'expo-router';

const callMobilePhone = async () => {
    const phoneNumber = '0113055307';
    const url = Platform.OS === 'ios' ? `telprompt:${phoneNumber}` : `tel:${phoneNumber}`;
    try {
        await Linking.openURL(url);
    } catch (error) {
        console.error('Error opening phone app:', error);
        Alert.alert('Error', 'Unable to open phone app');
    }
};

const PendingApproval = () => {
    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Ionicons name="hourglass" size={80} color={Colors.primary} style={styles.icon} />
                <View style={styles.progressBar} />
                <Text style={styles.title}>We're evaluating your profile</Text>
                <Text style={styles.description}>
                    In order to make sure our community holds up a standard, we don't allow any profiles to get in.
                </Text>
                <TouchableOpacity style={styles.button}
                    onPress={callMobilePhone}
                >
                    <Text style={styles.buttonText}>Fast Track</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{
                    marginTop: 10,
                }}
                    onPress={() => {
                        console.log('Go Home');
                        router.replace('/');
                    }}
                >
                    <Text style={styles.buttonText}>Go Home</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    content: {
        alignItems: 'center',
        width: '100%',
        maxWidth: 300,
    },
    icon: {
        marginBottom: 20,
    },
    progressBar: {
        width: '80%',
        height: 4,
        backgroundColor: Colors.primary,
        marginBottom: 20,
        borderRadius: 2,
    },
    title: {
        fontSize: 22,
        fontFamily: 'Nunito_700Bold',
        textAlign: 'center',
        marginBottom: 10,
    },
    description: {
        fontSize: 16,
        fontFamily: 'Nunito_400Regular',
        textAlign: 'center',
        marginBottom: 30,
    },
    button: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: Colors.primary,
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 25,
    },
    buttonText: {
        color: Colors.primary,
        fontSize: 16,
        fontFamily: 'Nunito_700Bold',
    },
});

export default PendingApproval;