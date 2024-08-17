import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { SafeAreaView } from 'react-native';
import NotificationPage from '~/pages/NotificationsPage';
import { router } from 'expo-router';
import { useUserStore } from '~/store/user-storage';

const Notifications = () => {
    const [notifications, setNotifications] = useState<any>([]);
    const { user } = useUserStore()

    const handleNotificationPress = (notification: any) => {
        console.log('Notification pressed:', notification);
    };

    return (
        <SafeAreaView style={{ flex: 1, paddingTop: 32 }}>
            <NotificationPage
                onNotificationPress={handleNotificationPress} onBackPress={function (): void {
                    router.back();
                }}            
            />
        </SafeAreaView>
    );
};

export default Notifications;