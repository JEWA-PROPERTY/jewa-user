import React, { useState } from 'react';
import { View, StyleSheet, Modal, TouchableOpacity, TextInput, ScrollView, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { defaultStyles } from '~/constants/Styles';
import Colors from '~/constants/Colors';
import JewaText from '~/components/JewaText';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';

const PreAuthorizeVisitorModal = ({ isVisible, onClose, onSubmit, loading }: any) => {
    const [formData, setFormData] = useState({
        phone: '',
        name: '',
        mode_of_entry: '',
        vehicle_number: '',
        verification_number: '',
        validity: '',
    });

    const handleChange = (key: string, value: string) => {
        setFormData(prevData => ({ ...prevData, [key]: value }));
    };

    const handleSubmit = () => {
        onSubmit(formData);
        setFormData({
            phone: '',
            name: '',
            mode_of_entry: '',
            vehicle_number: '',
            verification_number: '',
            validity: '',
        });
    };

    const isFormValid = () => {
        return formData.phone !== '' && formData.name !== '' && formData.mode_of_entry !== '' && formData.validity !== '';
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isVisible}
            onRequestClose={onClose}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.modalContainer}
            >
                <View style={styles.modalContent}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={styles.modalHeader}>
                            <JewaText style={styles.modalTitle}>Pre-authorize Visitor</JewaText>
                            <TouchableOpacity onPress={onClose}>
                                <Ionicons name="close" size={24} color={Colors.primary} />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.inputContainer}>
                            <Ionicons name="call-outline" size={24} color={Colors.gray} style={styles.icon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Phone"
                                placeholderTextColor={Colors.gray}
                                value={formData.phone}
                                onChangeText={(text) => handleChange('phone', text)}
                                keyboardType="phone-pad"
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Ionicons name="person-outline" size={24} color={Colors.gray} style={styles.icon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Name"
                                placeholderTextColor={Colors.gray}
                                value={formData.name}
                                onChangeText={(text) => handleChange('name', text)}
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Ionicons name="calendar-outline" size={24} color={Colors.gray} style={styles.icon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Validity in Days"
                                placeholderTextColor={Colors.gray}
                                value={formData.validity}
                                onChangeText={(text) => handleChange('validity', text)}
                                keyboardType="numeric"
                            />
                        </View>

                        <View style={styles.pickerContainer}>
                            <Ionicons name="car-outline" size={24} color={Colors.gray} style={styles.icon} />
                            <Picker
                                selectedValue={formData.mode_of_entry}
                                onValueChange={(itemValue: string) => handleChange('mode_of_entry', itemValue)}
                                style={styles.picker}
                            >
                                <Picker.Item label="Select Mode of Entry" value="" />
                                <Picker.Item label="Walk" value="walk" />
                                <Picker.Item label="Vehicle" value="vehicle" />
                                <Picker.Item label="Motorcycle" value="motorcycle" />
                            </Picker>
                        </View>

                        {formData.mode_of_entry === 'vehicle' && (
                            <View style={styles.inputContainer}>
                                <Ionicons name="car-sport-outline" size={24} color={Colors.gray} style={styles.icon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Vehicle Number"
                                    placeholderTextColor={Colors.gray}
                                    value={formData.vehicle_number}
                                    onChangeText={(text) => handleChange('vehicle_number', text)}
                                />
                            </View>
                        )}

                        <View style={styles.inputContainer}>
                            <Ionicons name="shield-checkmark-outline" size={24} color={Colors.gray} style={styles.icon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Verification Number"
                                placeholderTextColor={Colors.gray}
                                value={formData.verification_number}
                                onChangeText={(text) => handleChange('verification_number', text)}
                            />
                        </View>

                        <TouchableOpacity
                            style={[styles.submitButton, !isFormValid() && styles.disabledButton]}
                            onPress={handleSubmit}
                            disabled={loading || !isFormValid()}
                        >
                            {loading ? (
                                <ActivityIndicator size="small" color="white" />
                            ) : (
                                <JewaText style={styles.submitButtonText}>Submit</JewaText>
                            )}
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 20,
        width: '90%',
        maxHeight: '80%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 24,
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
    input: {
        flex: 1,
        fontSize: 16,
        paddingVertical: 10,
        fontFamily: 'Nunito_400Regular',
    },
    pickerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: Colors.lightGray,
        marginBottom: 20,
    },
    picker: {
        flex: 1,
        marginLeft: -10,
    },
    submitButton: {
        backgroundColor: Colors.primary,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
    },
    disabledButton: {
        opacity: 0.5,
    },
    submitButtonText: {
        color: 'white',
        fontSize: 16,
        fontFamily: 'Nunito_600SemiBold',
    },
});

export default PreAuthorizeVisitorModal;