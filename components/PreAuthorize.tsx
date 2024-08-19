import React, { useState } from 'react';
import { View, StyleSheet, Modal, TouchableOpacity, TextInput, ScrollView, ActivityIndicator } from 'react-native';
import { defaultStyles } from '~/constants/Styles';
import Colors from '~/constants/Colors';
import JewaText from '~/components/JewaText';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';

const PreAuthorizeVisitorModal = ({ isVisible, onClose, onSubmit, loading }: any) => {
    const [formData, setFormData] = useState({
        phone: '',
        name: '',
        house_id: '',
        resident_id: '',
        mode_of_entry: '',
        vehicle_number: '',
        verification_number: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    //@ts-ignore
    const handleChange = (key, value) => {
        setFormData(prevData => ({ ...prevData, [key]: value }));
    };

    const handleSubmit = () => {
        onSubmit(formData);
        onClose();
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isVisible}
            onRequestClose={onClose}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <ScrollView>
                        <View style={styles.modalHeader}>
                            <JewaText style={styles.modalTitle}>Pre-authorize Visitor</JewaText>
                            <TouchableOpacity onPress={onClose}>
                                <Ionicons name="close" size={24} color={Colors.primary} />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.inputContainer}>
                            <JewaText style={styles.label}>Phone</JewaText>
                            <TextInput
                                style={styles.input}
                                value={formData.phone}
                                onChangeText={(text) => handleChange('phone', text)}
                                keyboardType="phone-pad"
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <JewaText style={styles.label}>Name</JewaText>
                            <TextInput
                                style={styles.input}
                                value={formData.name}
                                onChangeText={(text) => handleChange('name', text)}
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <JewaText style={styles.label}>House ID</JewaText>
                            <TextInput
                                style={styles.input}
                                value={formData.house_id}
                                onChangeText={(text) => handleChange('house_id', text)}
                                keyboardType="numeric"
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <JewaText style={styles.label}>Resident ID</JewaText>
                            <TextInput
                                style={styles.input}
                                value={formData.resident_id}
                                onChangeText={(text) => handleChange('resident_id', text)}
                                keyboardType="numeric"
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <JewaText style={styles.label}>Mode of Entry:</JewaText>
                            <Picker
                                selectedValue={formData.mode_of_entry}
                                onValueChange={(itemValue: any) => handleChange('mode_of_entry', itemValue)}
                            >
                                <Picker.Item label="Walk" value="walk" />
                                <Picker.Item label="Vehicle" value="vehicle" />
                            </Picker>
                        </View>

                        {formData.mode_of_entry === 'vehicle' && (
                            <TextInput
                                style={styles.input}
                                placeholder="Vehicle Number"
                                value={formData.vehicle_number}
                                onChangeText={(text) => handleChange('vehicle_number', text)}
                            />
                        )}

                        <View style={styles.inputContainer}>
                            <JewaText style={styles.label}>Verification Number</JewaText>
                            <TextInput
                                style={styles.input}
                                value={formData.verification_number}
                                onChangeText={(text) => handleChange('verification_number', text)}
                            />
                        </View>

                        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                            {
                                loading ? <ActivityIndicator size="small" color="white" /> :
                                    <JewaText style={styles.submitButtonText}>Submit</JewaText>
                            }
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            </View>
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
        borderRadius: 8,
        padding: 16,
        width: '90%',
        maxHeight: '80%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    modalTitle: {
        fontSize: 18,
        fontFamily: 'Nunito_600SemiBold',
    },
    inputContainer: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontFamily: 'Nunito_600SemiBold',
        marginBottom: 4,
    },
    input: {
        ...defaultStyles.input,
        backgroundColor: Colors.lightGray,
        padding: 10,
        borderRadius: 8,
        fontSize: 16,
    },
    submitButton: {
        backgroundColor: Colors.primary,
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 16,
    },
    submitButtonText: {
        color: 'white',
        fontSize: 16,
        fontFamily: 'Nunito_600SemiBold',
    },
});

export default PreAuthorizeVisitorModal;