import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import JewaText from '~/components/JewaText';
import { useUserStore } from '~/store/user-storage';
import axios from 'axios';

type Notification = {
    id: number;
    notification_message: string;
    notification_image: string;
    notification_status: string;
    type_of_delivery: string | null;
    notification_type: string | null;
    created_at: string;
};

type NotificationPageProps = {
    onNotificationPress: (notification: Notification) => void;
    onBackPress: () => void;
};


const NotificationPage: React.FC<NotificationPageProps> = ({ onNotificationPress, onBackPress }) => {
    const [notifications, setNotifications] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
    const {user} = useUserStore();

    const fetchNotifications = async () => {
        const response = await axios.post('https://jewapropertypro.com/infinity/api/allnotifications', {
            resident_id: user?.userid
        });
        console.log(response.data);
        const data = response.data;
        setNotifications(data.message);
    };
    
    useEffect(() => {
        loadNotifications();
    }, []);

    const loadNotifications = async () => {
        setIsLoading(true);
        try {
            const fetchedNotifications = await fetchNotifications();
            const sortedNotifications = fetchedNotifications.sort((a, b) => 
                new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            );
            setNotifications(sortedNotifications);
        } catch (error) {
            // console.error('Error fetching notifications:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const notificationTypeConfig: Record<string, { color: string; icon: string }> = {
        General: { color: '#3498db', icon: 'notifications-outline' },
        Electronics: { color: '#e67e22', icon: 'bulb' },
        Visitor: { color: '#2ecc71', icon: 'person-outline' },
        Delivery: { color: '#9b59b6', icon: 'cube-outline' },
    };

    const handleNotificationPress = (notification: Notification) => {
        setSelectedNotification(notification);
        setModalVisible(true);
        onNotificationPress(notification);
    };

    const handleModalClose = () => {
        setModalVisible(false);
        setSelectedNotification(null);
    };

    const handleApprove = () => {
        // Handle approve logic
        handleModalClose();
    };

    const handleDeny = () => {
        // Handle deny logic
        handleModalClose();
    };

    const handleLeaveAtGate = () => {
        // Handle leave at gate logic
        handleModalClose();
    };

    const renderNotificationItem = ({ item }: { item: Notification }) => {
        const notificationType = item.notification_type || item.type_of_delivery || 'General';
        const { color, icon } = notificationTypeConfig[notificationType] || notificationTypeConfig.General;

        return (
            <TouchableOpacity style={styles.notificationItem} onPress={() => handleNotificationPress(item)}>
                <View style={[styles.iconCircle, { backgroundColor: color }]}>
                    <Ionicons name={icon} size={24} color="#fff" />
                </View>
                <View style={styles.notificationContent}>
                    <JewaText style={styles.notificationMessage}>{item.notification_message}</JewaText>
                    <JewaText style={styles.notificationInfo}>
                        {item.type_of_delivery || item.notification_type || 'General'}
                    </JewaText>
                    <JewaText style={styles.notificationDate}>
                        {new Date(item.created_at).toLocaleString()}
                    </JewaText>
                </View>
                <View style={styles.notificationStatus}>
                    <JewaText style={[
                        styles.statusText,
                        item.notification_status === 'Pending' ? styles.pendingStatus : styles.respondedStatus
                    ]}>
                        {item.notification_status}
                    </JewaText>
                    <Ionicons
                        name={item.notification_status === 'Pending' ? 'time-outline' : 'checkmark-circle-outline'}
                        size={24}
                        color={item.notification_status === 'Pending' ? '#FFA500' : '#4CAF50'}
                    />
                </View>
            </TouchableOpacity>
        );
    };

    const renderModal = () => (
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={handleModalClose}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <JewaText style={styles.modalTitle}>Notification Details</JewaText>
                    <JewaText style={styles.modalMessage}>{selectedNotification?.notification_message}</JewaText>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.button} onPress={handleApprove}>
                            <JewaText style={styles.buttonText}>Approve</JewaText>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={handleDeny}>
                            <JewaText style={styles.buttonText}>Deny</JewaText>
                        </TouchableOpacity>
                        {(selectedNotification?.notification_type === "Delivery" || selectedNotification?.type_of_delivery === "Delivery") && (
                            <TouchableOpacity style={styles.button} onPress={handleLeaveAtGate}>
                                <JewaText style={styles.buttonText}>Leave at Gate</JewaText>
                            </TouchableOpacity>
                        )}
                    </View>
                    <TouchableOpacity style={styles.closeButton} onPress={handleModalClose}>
                        <Ionicons name="close" size={24} color="#000" />
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={onBackPress}>
                    <Ionicons name="arrow-back-outline" size={24} color="#000" />
                </TouchableOpacity>
                <JewaText style={styles.header}>Notifications</JewaText>
            </View>
            {isLoading ? (
                <ActivityIndicator size="large" color="#3498db" style={styles.activityIndicator} />
            ) : (
                <FlatList
                    data={notifications}
                    renderItem={renderNotificationItem}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.listContainer}
                    refreshing={isLoading}
                    onRefresh={loadNotifications}
                />
            )}
            {renderModal()}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginLeft: 16,
    },
    listContainer: {
        padding: 16,
    },
    notificationItem: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    iconCircle: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    notificationContent: {
        flex: 1,
    },
    notificationMessage: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 4,
    },
    notificationInfo: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    notificationDate: {
        fontSize: 12,
        color: '#999',
    },
    notificationStatus: {
        alignItems: 'center',
    },
    statusText: {
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    pendingStatus: {
        color: '#FFA500',
    },
    respondedStatus: {
        color: '#4CAF50',
    },
    activityIndicator: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        padding: 20,
        width: '80%',
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    modalMessage: {
        fontSize: 16,
        marginBottom: 20,
        textAlign: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
    },
    button: {
        backgroundColor: '#3498db',
        padding: 10,
        borderRadius: 5,
        marginHorizontal: 5,
    },
    buttonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
    },
});

export default NotificationPage;