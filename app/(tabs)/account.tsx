import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, TextInput, Alert, ActivityIndicator } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import Colors from '~/constants/Colors';
import { router } from 'expo-router';
import { useUserStore } from '~/store/user-storage';

const SettingsOption = ({ icon, title, onPress, IconComponent = Ionicons }: any) => (
    <TouchableOpacity style={styles.option} onPress={onPress}>
        <IconComponent name={icon} size={24} color={Colors.primary} style={styles.optionIcon} />
        <Text style={styles.optionText}>{title}</Text>
        <Ionicons name="chevron-forward" size={24} color={Colors.gray} />
    </TouchableOpacity>
);

const ChangePasswordModal = ({ visible, onClose, onSuccess }: any) => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { user: userDetails } = useUserStore();

    const handleChangePassword = async () => {
        if (newPassword !== confirmPassword) {
            Alert.alert("Error", "New passwords do not match");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('https://jewapropertypro.com/infinity/api/updatepassword', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userid: userDetails?.userid,
                    password: newPassword,
                    password_confirmation: confirmPassword
                })
            });

            const data = await response.json();

            if (data.message === 'Password changed successfully') {
                Alert.alert("Success", "Password changed successfully. Please log in again.");
                onSuccess();
            } else {
                Alert.alert("Error", data.message || "Failed to change password");
            }
        } catch (error) {
            console.error("Password change error:", error);
            Alert.alert("Error", "An error occurred while changing the password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="slide"
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Change Password</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Current Password"
                        secureTextEntry
                        value={currentPassword}
                        onChangeText={setCurrentPassword}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="New Password"
                        secureTextEntry
                        value={newPassword}
                        onChangeText={setNewPassword}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Confirm New Password"
                        secureTextEntry
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                    />
                    <TouchableOpacity
                        style={[styles.button, loading && styles.disabledButton]}
                        onPress={handleChangePassword}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text style={styles.buttonText}>Change Password</Text>
                        )}
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Text style={styles.closeButtonText}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const EditProfileModal = ({ visible, onClose, onSuccess, userDetails }: any) => {
    const [fullname, setFullname] = useState(userDetails?.fullname || '');
    const [email, setEmail] = useState(userDetails?.email || '');
    const [phone, setPhone] = useState(userDetails?.phone || '');
    const [loading, setLoading] = useState(false);

    const handleUpdateProfile = async () => {
        setLoading(true);

        try {
            const response = await fetch('https://jewapropertypro.com/infinity/api/updateuserdetails', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    phone,
                    fullname
                })
            });

            const data = await response.json();

            if (data.message === 'User update is successful') {
                Alert.alert("Success", "Profile updated successfully");
                onSuccess(data.userdetails[0]);     
                onClose();
                
            } else {
                Alert.alert("Error", data.message || "Failed to update profile");
            }
        } catch (error) {
            console.error("Profile update error:", error);
            Alert.alert("Error", "An error occurred while updating the profile");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="slide"
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Edit Profile</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Full Name"
                        value={fullname}
                        onChangeText={setFullname}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Phone"
                        value={phone}
                        onChangeText={setPhone}
                        keyboardType="phone-pad"
                    />
                    <TouchableOpacity
                        style={[styles.button, loading && styles.disabledButton]}
                        onPress={handleUpdateProfile}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text style={styles.buttonText}>Update Profile</Text>
                        )}
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Text style={styles.closeButtonText}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const Account = () => {
    const { user: userDetails, logout, setUser } = useUserStore();
    const [changePasswordVisible, setChangePasswordVisible] = useState(false);
    const [editProfileVisible, setEditProfileVisible] = useState(false);

    const name = `${userDetails?.fullname}` || 'User';

    const handleChangePasswordSuccess = () => {
        setChangePasswordVisible(false);
        logout();
        router.push('/login');
    };

    const handleEditProfileSuccess = (updatedDetails) => {
        setEditProfileVisible(false);
        setUser(updatedDetails);
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.cardTitle}>Account Information</Text>
                <Text style={styles.cardText}>Name: {name}</Text>
                <Text style={styles.cardText}>Email: {userDetails?.email || '-'}</Text>
                <Text style={styles.cardText}>Phone: {userDetails?.phone}</Text>
            </View>

            <View style={styles.optionsContainer}>
                <SettingsOption 
                    icon="person-outline" 
                    title="Edit Profile" 
                    onPress={() => setEditProfileVisible(true)} 
                />
                <SettingsOption icon="lock-closed-outline" title="Privacy" onPress={() => {}} />
                <SettingsOption icon="help-circle-outline" title="Help & Support" onPress={() => {}} />
            </View>

            <View style={styles.bottomOptions}>
                <SettingsOption
                    icon="key"
                    title="Change Password"
                    onPress={() => setChangePasswordVisible(true)}
                    IconComponent={MaterialIcons}
                />
                <SettingsOption
                    icon="log-out-outline"
                    title="Logout"
                    onPress={() => {
                        logout();
                        router.push('/login');
                    }}
                />
            </View>

            <ChangePasswordModal
                visible={changePasswordVisible}
                onClose={() => setChangePasswordVisible(false)}
                onSuccess={handleChangePasswordSuccess}
            />

            <EditProfileModal
                visible={editProfileVisible}
                onClose={() => setEditProfileVisible(false)}
                onSuccess={handleEditProfileSuccess}
                userDetails={userDetails}
            />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        marginTop: 90,
    },
    card: {
        backgroundColor: 'white',
        margin: 16,
        padding: 16,
        borderRadius: 8,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
        color: Colors.primary,
    },
    cardText: {
        fontSize: 16,
        marginBottom: 4,
        color: Colors.dark,
    },
    optionsContainer: {
        backgroundColor: 'white',
        marginTop: 16,
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    optionIcon: {
        marginRight: 16,
    },
    optionText: {
        flex: 1,
        fontSize: 16,
        color: Colors.dark,
    },
    bottomOptions: {
        backgroundColor: 'white',
        marginTop: 16,
        marginBottom: 32,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        width: '80%',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: Colors.lightGray,
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    },
    button: {
        backgroundColor: Colors.primary,
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    closeButton: {
        marginTop: 10,
        alignItems: 'center',
    },
    closeButtonText: {
        color: Colors.primary,
    },
    disabledButton: {
        opacity: 0.5,
    },
});

export default Account;