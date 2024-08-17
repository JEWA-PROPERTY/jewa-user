import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, SafeAreaView, Image, Modal, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { defaultStyles } from '~/constants/Styles';
import Colors from '~/constants/Colors';
import { useUserStore } from '~/store/user-storage';

type Delivery = {
    id: string;
    name: string;
    type: 'delivery';
    phoneNumbers: string[];
    otp: string;
    validUntil: Date;
    avatar?: string;
    title?: string;
    leaveAtDoor: boolean;
    approved: boolean;
};

const DeliveryManagementPage: React.FC = () => {
    const [deliveries, setDeliveries] = useState<Delivery[]>([]);
    const [pendingDeliveries, setPendingDeliveries] = useState<Delivery[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null);
    const [showApprovalModal, setShowApprovalModal] = useState(false);
    const { user } = useUserStore();

    useEffect(() => {
        fetchDeliveries();
    }, []);

    const fetchDeliveries = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('https://jewapropertypro.com/infinity/api/getalldeliveries', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "resident_id": user?.userid
                }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            
            if (data && Array.isArray(data.message)) {
                const fetchedDeliveries = data.message.map((delivery: any) => ({
                    id: delivery.id.toString(),
                    name: delivery.name,
                    type: 'delivery',
                    phoneNumbers: [delivery.phone],
                    otp: delivery.otp,
                    validUntil: new Date(delivery.validUntil),
                    avatar: delivery.avatar || `https://i.pravatar.cc/150?u=${delivery.id}`,
                    title: delivery.title,
                    leaveAtDoor: delivery.leaveAtDoor,
                    approved: delivery.approved
                }));
                
                setPendingDeliveries(fetchedDeliveries.filter(d => !d.approved));
                setDeliveries(fetchedDeliveries.filter(d => d.approved));
            } else {
                setPendingDeliveries([]);
                setDeliveries([]);
            }
        } catch (err) {
            setError('Failed to fetch deliveries. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const approveDelivery = (delivery: Delivery) => {
        setDeliveries([...deliveries, { ...delivery, approved: true }]);
        setPendingDeliveries(pendingDeliveries.filter(d => d.id !== delivery.id));
        setShowApprovalModal(false);
    };

    const denyDelivery = (deliveryId: string) => {
        setPendingDeliveries(pendingDeliveries.filter(d => d.id !== deliveryId));
        setShowApprovalModal(false);
    };

    const renderPendingDeliveryItem = ({ item }: { item: Delivery }) => (
        <TouchableOpacity
            style={styles.pendingDeliveryItem}
            onPress={() => {
                setSelectedDelivery(item);
                setShowApprovalModal(true);
            }}
        >
            <Image source={{ uri: item.avatar }} style={styles.pendingAvatar} />
            <Text style={styles.pendingName}>{item.title}</Text>
        </TouchableOpacity>
    );

    const renderDeliveryItem = ({ item }: { item: Delivery }) => (
        <TouchableOpacity style={styles.deliveryItem} onPress={() => setSelectedDelivery(item)}>
            <Image source={{ uri: item.avatar }} style={styles.avatar} />
            <View style={styles.deliveryInfo}>
                <Text style={styles.deliveryName}>{item.name}</Text>
                <Text>Delivery</Text>
                <Text>OTP: {item.otp}</Text>
            </View>
        </TouchableOpacity>
    );

    const DeliveryTicket = () => (
        <Modal
            visible={!!selectedDelivery && !showApprovalModal}
            transparent
            animationType="slide"
            onRequestClose={() => setSelectedDelivery(null)}
        >
            <View style={styles.modalContainer}>
                <View style={styles.ticketContainer}>
                    <Image source={{ uri: selectedDelivery?.avatar }} style={styles.ticketAvatar} />
                    <Text style={styles.ticketName}>{selectedDelivery?.name}</Text>
                    <Text style={styles.ticketType}>Delivery</Text>
                    <Text style={styles.ticketOTP}>OTP: {selectedDelivery?.otp}</Text>
                    <Text style={styles.ticketValidity}>Valid until: {selectedDelivery?.validUntil.toLocaleString()}</Text>
                    <Text style={styles.ticketLeaveAtDoor}>Leave at the Gate: {selectedDelivery?.leaveAtDoor ? 'Yes' : 'No'}</Text>
                    <TouchableOpacity style={styles.closeButton} onPress={() => setSelectedDelivery(null)}>
                        <Ionicons name="close-circle" size={24} color={Colors.primary} />
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );

    const ApprovalModal = () => (
        <Modal
            visible={showApprovalModal}
            transparent
            animationType="slide"
            onRequestClose={() => setShowApprovalModal(false)}
        >
            <View style={styles.modalContainer}>
                <View style={styles.approvalContainer}>
                    <Text style={styles.approvalTitle}>Approve {selectedDelivery?.title}?</Text>
                    <View style={styles.approvalButtons}>
                        <TouchableOpacity style={[styles.approvalButton, styles.approveButton]} onPress={() => selectedDelivery && approveDelivery(selectedDelivery)}>
                            <Ionicons name="checkmark-circle" size={24} color="white" />
                            <Text style={styles.approvalButtonText}>Approve</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.approvalButton, styles.denyButton]} onPress={() => selectedDelivery && denyDelivery(selectedDelivery.id)}>
                            <Ionicons name="close-circle" size={24} color="white" />
                            <Text style={styles.approvalButtonText}>Deny</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );

    if (loading) {
        return (
            <SafeAreaView style={[defaultStyles.container, styles.centerContent]}>
                <ActivityIndicator size="large" color={Colors.primary} />
                <Text style={styles.loadingText}>Loading deliveries...</Text>
            </SafeAreaView>
        );
    }

    if (error) {
        return (
            <SafeAreaView style={[defaultStyles.container, styles.centerContent]}>
                <Text style={styles.errorText}>Error: {error}</Text>
                <TouchableOpacity onPress={fetchDeliveries} style={styles.retryButton}>
                    <Text style={styles.retryButtonText}>Retry</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={defaultStyles.container}>
            <View style={styles.pendingDeliveriesContainer}>
                <Text style={styles.sectionTitle}>Pending Approval</Text>
                {pendingDeliveries.length > 0 ? (
                    <FlatList
                        data={pendingDeliveries}
                        renderItem={renderPendingDeliveryItem}
                        keyExtractor={item => item.id}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                    />
                ) : (
                    <Text style={styles.noDeliveriesText}>No pending deliveries</Text>
                )}
            </View>

            <View style={styles.approvedDeliveriesContainer}>
                <Text style={styles.sectionTitle}>Approved Deliveries</Text>
                {deliveries.length > 0 ? (
                    <FlatList
                        data={deliveries}
                        renderItem={renderDeliveryItem}
                        keyExtractor={item => item.id}
                    />
                ) : (
                    <Text style={styles.noDeliveriesText}>No approved deliveries</Text>
                )}
            </View>

            <DeliveryTicket />
            <ApprovalModal />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    centerContent: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
    },
    errorText: {
        fontSize: 16,
        color: 'red',
        marginBottom: 10,
    },
    pendingDeliveriesContainer: {
        padding: 16,
    },
    approvedDeliveriesContainer: {
        flex: 1,
        padding: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    pendingDeliveryItem: {
        marginRight: 16,
        alignItems: 'center',
    },
    pendingAvatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    pendingName: {
        marginTop: 8,
        fontSize: 14,
        textAlign: 'center',
    },
    deliveryItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 16,
    },
    deliveryInfo: {
        flex: 1,
    },
    deliveryName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    ticketContainer: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
        position: 'relative',
    },
    ticketAvatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 10,
    },
    ticketName: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    ticketType: {
        fontSize: 16,
        marginBottom: 10,
    },
    ticketOTP: {
        fontSize: 16,
        marginBottom: 10,
    },
    ticketValidity: {
        fontSize: 16,
        marginBottom: 10,
    },
    ticketLeaveAtDoor: {
        fontSize: 16,
        marginBottom: 10,
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
    },
    approvalContainer: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    approvalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    approvalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '80%',
    },
    approvalButton: {
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        flex: 1,
        marginHorizontal: 5,
    },
    approveButton: {
        backgroundColor: 'green',
    },
    denyButton: {
        backgroundColor: 'red',
    },
    approvalButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    noDeliveriesText: {
        fontStyle: 'italic',
        color: '#888',
        textAlign: 'center',
        marginTop: 20,
    },
    retryButton: {
        backgroundColor: Colors.primary,
        padding: 10,
        borderRadius: 5,
        marginTop: 20,
    },
    retryButtonText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default DeliveryManagementPage;