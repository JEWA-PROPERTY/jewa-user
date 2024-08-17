import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { SafeAreaView } from 'react-native';
import NotificationPage from '~/pages/NotificationsPage';
import { router } from 'expo-router';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        const response = await axios.post('https://jewapropertypro.com/infinity/api/allnotifications', {
            resident_id: 4,
        });
        const data = response.data;
        setNotifications(data.message);
    };

    const handleNotificationPress = (notification: any) => {
        // Handle notification press here
        console.log('Notification pressed:', notification);
    };

    return (
        <SafeAreaView style={{ flex: 1, paddingTop: 32}}>
            <NotificationPage
                notifications={notifications}
                onNotificationPress={handleNotificationPress} onBackPress={function (): void {
                    router.back();
                } } isLoading={false}            />
        </SafeAreaView>
    );
};

export default Notifications;