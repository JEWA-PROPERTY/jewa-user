import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, FlatList, SafeAreaView, Image, Modal, ActivityIndicator, ScrollView } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { defaultStyles } from '~/constants/Styles';
import Colors from '~/constants/Colors';
import { useUserStore } from '~/store/user-storage';
import JewaText from '~/components/JewaText';

type Delivery = {
    id: number;
    destination: string | null;
    type_of_delivery: string | null;
    resident_id: number;
    delivery_status: "1" | "2" | "3";
    mode_of_delivery: string | null;
    created_at: string;
    updated_at: string | null;
    time_in: string | null;
    time_out: string | null;
    vehicle_number: string | null;
    delivery_name: string | null;
    delivery_phone: string | null;
    delivery_verification_number: string | null;
    house_id: number;
    otp: string;
    notif_id: number;
    leaveatgate_status: string;
};

const DeliveryManagementPage: React.FC = () => {
    const [deliveries, setDeliveries] = useState<Delivery[]>([]);
    const [pendingDeliveries, setPendingDeliveries] = useState<Delivery[]>([]);
    const [pickedDeliveries, setPickedDeliveries] = useState<Delivery[]>([]);
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
                    "resident_id": user?.userid,
                }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();

            if (data && Array.isArray(data.message)) {
                const fetchedDeliveries: Delivery[] = data.message;
                console.log("Deliveries::", fetchedDeliveries)
                setPendingDeliveries(fetchedDeliveries.filter(d => d.leaveatgate_status !== 'Picked' && d.delivery_status === "1"
                    && d.resident_id === user?.userid));

                setPickedDeliveries(fetchedDeliveries.filter(d => d.leaveatgate_status === 'Picked' && d.delivery_status === "2"
                    && d.resident_id === user?.userid));

                setDeliveries(fetchedDeliveries.filter(d => d.delivery_status === "2"));
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
        setDeliveries([...deliveries, { ...delivery, delivery_status: '2' }]);
        setPendingDeliveries(pendingDeliveries.filter(d => d.id !== delivery.id));
        setShowApprovalModal(false);
    };

    const denyDelivery = (deliveryId: number) => {
        setPendingDeliveries(pendingDeliveries.filter(d => d.id !== deliveryId));
        setShowApprovalModal(false);
    };

    const renderPendingDeliveryItem = ({ item }: { item: Delivery }) => (
        <TouchableOpacity
            style={styles.pendingDeliveryItem}
            onPress={() => {
                setSelectedDelivery(item);
            }}
        >
            <View style={styles.pendingIconContainer}>
                <MaterialCommunityIcons name="package-variant-closed" size={24} color={Colors.primary} />
            </View>
            <JewaText style={styles.pendingName}>{item.type_of_delivery || 'Unknown Delivery'}</JewaText>
        </TouchableOpacity>
    );

    const renderDeliveryItem = ({ item }: { item: Delivery }) => (
        <TouchableOpacity style={styles.deliveryItem} onPress={() => setSelectedDelivery(item)}>
            <View style={styles.deliveryIconContainer}>
                <MaterialCommunityIcons name="package-variant" size={24} color={'white'} />
            </View>
            <View style={styles.deliveryInfo}>
                <JewaText style={styles.deliveryName}>{item.type_of_delivery || 'Unknown Delivery'}</JewaText>
                <JewaText style={styles.deliveryDetails}>
                    <Ionicons name="time-outline" size={16} color={Colors.gray} /> {new Date(item.created_at).toLocaleDateString()}
                </JewaText>
                {item.delivery_name && (
                    <JewaText style={styles.deliveryDetails}>
                        <Ionicons name="person-outline" size={16} color={Colors.gray} /> {item.delivery_name}
                    </JewaText>
                )}
            </View>
            <TouchableOpacity style={styles.moreInfoButton}>
                <Ionicons name="chevron-forward" size={24} color={Colors.primary} />
            </TouchableOpacity>
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
                    <View style={styles.ticketRow}>
                        <MaterialCommunityIcons name="package-variant" size={24} color={Colors.primary} />
                        <JewaText style={styles.ticketTitle}>{selectedDelivery?.type_of_delivery || 'Unknown Delivery'}</JewaText>
                    </View>
                    <View style={styles.ticketRow}>

                        <JewaText style={styles.ticketDetail}>Time In: {new Date(selectedDelivery?.time_in || '').toLocaleString()}</JewaText>
                    </View>
                    <View style={styles.ticketRow}>

                        <JewaText style={styles.ticketDetail}>Time Out: {new Date(selectedDelivery?.time_out || '').toLocaleString()}</JewaText>
                    </View>
                    <View style={styles.ticketRow}>
                        <JewaText style={styles.ticketDetail}>Status: {selectedDelivery?.delivery_status === '2' ? 'Approved' : 'Pending'}</JewaText>
                    </View>
                    <View style={styles.ticketRow}>
                        <JewaText style={styles.ticketDetail}> OTP:{selectedDelivery?.otp || 'N/A'}</JewaText>
                    </View>
                    <View style={styles.ticketRow}>

                        <JewaText style={styles.ticketDetail}> Phone:{selectedDelivery?.delivery_phone}</JewaText>
                    </View>
                    <View style={styles.ticketRow}>
                        <JewaText style={styles.ticketDetail}>Leave at gate: {selectedDelivery?.leaveatgate_status ? 'Yes' : 'No'}</JewaText>
                    </View>
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
                    <JewaText style={styles.approvalTitle}>Approve {selectedDelivery?.type_of_delivery || 'Delivery'}?</JewaText>
                    <View style={styles.approvalButtons}>
                        <TouchableOpacity style={[styles.approvalButton, styles.approveButton]} onPress={() => selectedDelivery && approveDelivery(selectedDelivery)}>
                            <Ionicons name="checkmark-circle" size={24} color="white" />
                            <JewaText style={styles.approvalButtonText}>Approve</JewaText>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.approvalButton, styles.denyButton]} onPress={() => selectedDelivery && denyDelivery(selectedDelivery.id)}>
                            <Ionicons name="close-circle" size={24} color="white" />
                            <JewaText style={styles.approvalButtonText}>Deny</JewaText>
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
                <JewaText style={styles.loadingText}>Loading deliveries...</JewaText>
            </SafeAreaView>
        );
    }

    if (error) {
        return (
            <SafeAreaView style={[defaultStyles.container, styles.centerContent]}>
                <JewaText style={styles.errorText}>Error: {error}</JewaText>
                <TouchableOpacity onPress={fetchDeliveries} style={styles.retryButton}>
                    <JewaText style={styles.retryButtonText}>Retry</JewaText>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={defaultStyles.container}>
            <View style={styles.pendingDeliveriesContainer}>
                <JewaText style={{
                    fontSize: 20,
                    marginBottom: 10,
                    fontFamily: 'Nunito_700Bold',
                    color: Colors.primary,
                }}>Pending pick up at the gate</JewaText>
                {pendingDeliveries.length > 0 ? (
                    <FlatList
                        data={pendingDeliveries}
                        renderItem={renderPendingDeliveryItem}
                        keyExtractor={item => item.id.toString()}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                    />
                ) : (
                    <JewaText style={styles.noDeliveriesText}>No pending deliveries</JewaText>
                )}
            </View>
            <View style={[styles.pendingDeliveriesContainer]}>
                <JewaText style={{
                    fontSize: 20,
                    marginBottom: 10,
                    fontFamily: 'Nunito_700Bold',
                    color: Colors.primary,
                }}>Picked deliveries</JewaText>
                {deliveries.length > 0 ? (
                    <FlatList
                        data={deliveries}
                        renderItem={renderPendingDeliveryItem}
                        keyExtractor={item => item.id.toString()}
                        style={{ marginBottom: 20 }}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                    />
                ) : (
                    <JewaText style={styles.noDeliveriesText}>No picked deliveries</JewaText>
                )}
            </View>
            <View style={styles.approvedDeliveriesContainer}>
                <JewaText style={{
                    fontSize: 20,
                    marginBottom: 10,
                    fontFamily: 'Nunito_700Bold',
                    color: Colors.primary,
                }}>Allowed deliveries</JewaText>
                {deliveries.length > 0 ? (
                    <FlatList
                        stickyHeaderHiddenOnScroll
                        data={deliveries}
                        renderItem={renderDeliveryItem}
                        keyExtractor={item => item.id.toString()}
                        style={{ marginBottom: 20 }} // Reduced margin as ScrollView adds spacing
                    />
                ) : (
                    <JewaText style={styles.noDeliveriesText}>No approved deliveries</JewaText>
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
    loadingJewaText: {
        marginTop: 10,
        fontSize: 16,
        color: Colors.gray,
        fontFamily: 'Nunito_600SemiBold',
    },
    errorJewaText: {
        fontSize: 16,
        color: 'red',
        marginBottom: 10,
        fontFamily: 'Nunito_600SemiBold',
    },
    pendingDeliveriesContainer: {
        padding: 16,
    },
    approvedDeliveriesContainer: {
        flex: 1,
    },
    sectionTitle: {
        marginBottom: 10,
        fontFamily: 'Nunito_700Bold',
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
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        backgroundColor: '#fff',
        padding: 15,
        marginVertical: 10,
        borderRadius: 10,
        width: '100%',
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
        fontFamily: 'Nunito_700Bold',
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
    ticketRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 4,
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
    approvalButtonJewaText: {
        color: 'white',
        fontWeight: 'bold',
    },
    noDeliveriesJewaText: {
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
    retryButtonJewaText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    retryButtonText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    // sectionTitle: {
    //     fontSize: 20,
    //     fontWeight: 'bold',
    //     marginBottom: 16,
    //     color: Colors.primary,
    // },
    pendingIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Colors.lightGray,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    deliveryIconContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    deliveryDetails: {
        fontSize: 14,
        color: Colors.gray,
        marginBottom: 2,
    },
    moreInfoButton: {
        padding: 8,
    },
    ticketTitle: {
        fontSize: 20,
        fontFamily: 'Nunito_700Bold',
        marginBottom: 10,
    },
    ticketDetail: {
        fontSize: 16,
        marginBottom: 5,
        fontFamily: 'Nunito_600SemiBold',
    },
    approvalButtonText: {
        color: 'white',
        fontWeight: 'bold',
        marginLeft: 5,
    },
    noDeliveriesText: {
        fontStyle: 'italic',
        color: '#888',
        textAlign: 'center',
        marginTop: 20,
    },
});

export default DeliveryManagementPage;