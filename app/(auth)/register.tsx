import React, { useState } from 'react'
import { View, Text, Input, StyleSheet, Platform, KeyboardAvoidingView } from 'react-native'
import { defaultStyles } from '~/constants/Styles';

export default function Register() {
    const keyboardVerticalOffset = Platform.OS === 'ios' ? 80 : 0;
    const [loading, setLoading] = useState();

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior='padding'
            keyboardVerticalOffset={keyboardVerticalOffset}
            className="mt-9" >
            <Text style={defaultStyles.header}>Create Account</Text>
        </KeyboardAvoidingView>
    )
}