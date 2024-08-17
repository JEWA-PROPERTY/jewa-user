import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import JewaText from '~/components/JewaText';

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
    notifications: Notification[];
    onNotificationPress: (notification: Notification) => void;
    onBackPress: () => void;
isLoading: boolean;
};

const NotificationPage: React.FC<NotificationPageProps> = ({ notifications, onNotificationPress, onBackPress, isLoading }) => {
    const notificationTypeConfig: Record<string, { color: string; icon: string }> = {
        General: { color: '#3498db', icon: 'notifications-outline' },
        Electronics: { color: '#e67e22', icon: 'bulb' },
        Visitor: { color: '#2ecc71', icon: 'person-outline' },
    };

    const renderNotificationItem = ({ item }: { item: Notification }) => {
        const notificationType = item.notification_type || item.type_of_delivery || 'General';
        const { color, icon } = notificationTypeConfig[notificationType] || notificationTypeConfig.General;

        return (
            <TouchableOpacity style={styles.notificationItem} onPress={() => onNotificationPress(item)}>
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
                        styles.statusJewaText,
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
                />
            )}
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
    statusJewaText: {
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
});

export default NotificationPage;
