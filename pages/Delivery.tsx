import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, FlatList, SafeAreaView, Image, Modal, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { defaultStyles } from '~/constants/Styles';
import { router } from 'expo-router';
import Colors from '~/constants/Colors';
import { Picker } from '@react-native-picker/picker';

type Visitor = {
    id: string;
    name: string;
    type: 'individual' | 'group' | 'delivery';
    eventType?: string;
    phoneNumbers: string[];
    otp: string;
    validUntil: Date;
    avatar?: string;
    title?: string;
    leaveAtDoor?: boolean;  // New property
};

const DeliveryManagementPage: React.FC = () => {
    const [visitors, setVisitors] = useState<Visitor[]>([]);
    const [pendingVisitors, setPendingVisitors] = useState<Visitor[]>([
        { id: '1', name: 'Amazon Delivery', title: 'Amazon Delivery', avatar: 'https://i.pravatar.cc/150?u=1', type: 'delivery', phoneNumbers: ['1234567890'], otp: '123456', validUntil: new Date(), leaveAtDoor: true },
        { id: '2', name: 'Jumia Delivery', title: 'Jumia Delivery', avatar: 'https://i.pravatar.cc/150?u=2', type: 'individual', phoneNumbers: ['0987654321'], otp: '654321', validUntil: new Date(), leaveAtDoor: false },
    ]);
    const [isAddingVisitor, setIsAddingVisitor] = useState(false);
    const [visitorType, setVisitorType] = useState<'individual' | 'group' | 'delivery'>('individual');
    const [eventType, setEventType] = useState('');
    const [phoneNumbers, setPhoneNumbers] = useState('');
    const [selectedVisitor, setSelectedVisitor] = useState<Visitor | null>(null);
    const [showApprovalModal, setShowApprovalModal] = useState(false);
    const [leaveAtDoor, setLeaveAtDoor] = useState(false);

    const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

    const addVisitor = () => {
        if (phoneNumbers.trim() === '') {
            Alert.alert('Error', 'Please enter at least one phone number');
            return;
        }

        const newVisitor: Visitor = {
            id: Date.now().toString(),
            name: `Visitor ${visitors.length + 1}`,
            type: visitorType,
            eventType: visitorType === 'group' ? eventType : undefined,
            phoneNumbers: phoneNumbers.split(',').map(num => num.trim()),
            otp: generateOTP(),
            validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000),
            avatar: `https://i.pravatar.cc/150?u=${Date.now()}`,
            leaveAtDoor: visitorType === 'delivery' ? leaveAtDoor : undefined,
        };

        setVisitors([...visitors, newVisitor]);
        setIsAddingVisitor(false);
        setEventType('');
        setPhoneNumbers('');
        setLeaveAtDoor(false);
    };

    const approveVisitor = (visitor: Visitor) => {
        setVisitors([...visitors, visitor]);
        setPendingVisitors(pendingVisitors.filter(v => v.id !== visitor.id));
        setShowApprovalModal(false);
    };

    const denyVisitor = (visitorId: string) => {
        setPendingVisitors(pendingVisitors.filter(v => v.id !== visitorId));
        setShowApprovalModal(false);
    };

    const renderPendingVisitorItem = ({ item }: { item: Visitor }) => (
        <TouchableOpacity
            style={styles.pendingVisitorItem}
            onPress={() => {
                setSelectedVisitor(item);
                setShowApprovalModal(true);
            }}
        >
            <Image source={{ uri: item.avatar }} style={styles.pendingAvatar} />
            <Text style={[styles.pendingName, {
                fontFamily: 'Nunito_700Bold',
            }]}>{item.title}</Text>
        </TouchableOpacity>
    );

    const renderVisitorItem = ({ item }: { item: Visitor }) => (
        <TouchableOpacity style={styles.visitorItem} onPress={() => setSelectedVisitor(item)}>
            <Image source={{ uri: item.avatar }} style={styles.avatar} />
            <View style={styles.visitorInfo}>
                <Text style={styles.visitorName}>{item.name}</Text>
                <Text>{item.type === 'group' ? 'Group' : item.type === 'delivery' ? 'Delivery' : 'Individual'}</Text>
                <Text>OTP: {item.otp}</Text>
            </View>
        </TouchableOpacity>
    );

    const VisitorTicket = () => (
        <Modal
            visible={!!selectedVisitor && !showApprovalModal}
            transparent
            animationType="slide"
            onRequestClose={() => setSelectedVisitor(null)}
        >
            <View style={styles.modalContainer}>
                <View style={styles.ticketContainer}>
                    <Image source={{ uri: selectedVisitor?.avatar }} style={styles.ticketAvatar} />
                    <Text style={styles.ticketName}>{selectedVisitor?.name}</Text>
                    <Text style={styles.ticketType}>{selectedVisitor?.type === 'group' ? 'Group' : selectedVisitor?.type === 'delivery' ? 'Delivery' : 'Individual'}</Text>
                    {selectedVisitor?.eventType && <Text style={styles.ticketEvent}>Event: {selectedVisitor.eventType}</Text>}
                    <Text style={styles.ticketOTP}>OTP: {selectedVisitor?.otp}</Text>
                    <Text style={styles.ticketValidity}>Valid until: {selectedVisitor?.validUntil.toLocaleString()}</Text>
                    {selectedVisitor?.type === 'delivery' && (
                        <Text style={styles.ticketLeaveAtDoor}>Leave at the Gate: {selectedVisitor.leaveAtDoor ? 'Yes' : 'No'}</Text>
                    )}
                    <TouchableOpacity style={styles.closeButton} onPress={() => setSelectedVisitor(null)}>
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
                    <Text style={[styles.approvalTitle, {
                        fontFamily: 'Nunito_700Bold',
                    }
                    ]}>Approve {selectedVisitor?.title}?</Text>
                    <View style={styles.approvalButtons}>
                        <TouchableOpacity style={[styles.approvalButton, styles.approveButton]} onPress={() => approveVisitor(selectedVisitor!)}>
                            <Ionicons name="checkmark-circle" size={24} color="white" />
                            <Text style={styles.approvalButtonText}>Approve</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.approvalButton, styles.denyButton]} onPress={() => denyVisitor(selectedVisitor!.id)}>
                            <Ionicons name="close-circle" size={24} color="white" />
                            <Text style={styles.approvalButtonText}>Deny</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.approvalButton, styles.leaveButton]} onPress={() => approveVisitor(selectedVisitor!)}>
                            <Ionicons name="home" size={24} color="white" />
                            <Text style={styles.approvalButtonText}>Leave at Gate</Text>
                        </TouchableOpacity>
                    </View>
                    {selectedVisitor?.type === 'delivery' && (
                        <View style={styles.leaveAtDoorContainer}>
                            <Text>Leave at the gate: {selectedVisitor.leaveAtDoor ? 'Yes' : 'No'}</Text>
                        </View>
                    )}
                </View>
            </View>
        </Modal>
    );

    return (
        <SafeAreaView style={defaultStyles.container}>
            {/* <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>Delivery Management</Text>
        <TouchableOpacity onPress={() => setIsAddingVisitor(true)}>
          <Ionicons name="add-circle-outline" size={24} color="black" />
        </TouchableOpacity>
      </View> */}

            <View style={styles.pendingVisitorsContainer}>
                <Text style={[styles.sectionTitle, {
                    fontFamily: 'Nunito_700Bold',
                }]}>Pending Approval</Text>
                <FlatList
                    data={pendingVisitors}
                    renderItem={renderPendingVisitorItem}
                    keyExtractor={item => item.id}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                />
            </View>

            <View style={styles.approvedVisitorsContainer}>
                <Text style={[styles.sectionTitle, {
                    fontFamily: 'Nunito_700Bold',
                }]}>Approved Visitors</Text>
                <FlatList
                    data={visitors}
                    renderItem={renderVisitorItem}
                    keyExtractor={item => item.id}
                />
            </View>

            <VisitorTicket />
            <ApprovalModal />

            <Modal visible={isAddingVisitor} transparent animationType="slide" onRequestClose={() => setIsAddingVisitor(false)}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Add Delivery</Text>
                        <Picker selectedValue={visitorType} onValueChange={setVisitorType} style={styles.picker}>
                            <Picker.Item label="Individual" value="individual" />
                            <Picker.Item label="Group" value="group" />
                            <Picker.Item label="Delivery" value="delivery" />
                        </Picker>
                        {visitorType === 'group' && (
                            <TextInput
                                placeholder="Event Type"
                                value={eventType}
                                onChangeText={setEventType}
                                style={styles.input}
                            />
                        )}
                        <TextInput
                            placeholder="Phone Numbers (comma separated)"
                            value={phoneNumbers}
                            onChangeText={setPhoneNumbers}
                            style={styles.input}
                            keyboardType="numeric"
                        />
                        {visitorType === 'delivery' && (
                            <View style={styles.checkboxContainer}>
                                <Text style={styles.checkboxLabel}>Leave at the door?</Text>
                                <TouchableOpacity onPress={() => setLeaveAtDoor(!leaveAtDoor)} style={styles.checkbox}>
                                    <Ionicons name={leaveAtDoor ? "checkbox-outline" : "square-outline"} size={24} color="black" />
                                </TouchableOpacity>
                            </View>
                        )}
                        <TouchableOpacity onPress={addVisitor} style={styles.addButton}>
                            <Text style={styles.addButtonText}>Add Visitor</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        backgroundColor: 'white',
        elevation: 2,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: 'Nunito_700Bold',
    },
    pendingVisitorsContainer: {
        padding: 16,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: 'Nunito_700Bold',
        marginBottom: 8,
    },
    approvedVisitorsContainer: {
        flex: 1,
        padding: 16,
    },
    pendingVisitorItem: {
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
    visitorItem: {
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
    visitorInfo: {
        flex: 1,
    },
    visitorName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 16,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    picker: {
        width: '100%',
        marginBottom: 16,
    },
    input: {
        width: '100%',
        padding: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 4,
        marginBottom: 16,
    },
    addButton: {
        backgroundColor: Colors.primary,
        padding: 12,
        borderRadius: 4,
        alignItems: 'center',
    },
    addButtonText: {
        color: 'white',
        fontWeight: 'bold',
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
    ticketEvent: {
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
    leaveButton: {
        backgroundColor: '#B0E0E6',
    },
    approvalButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    leaveAtDoorContainer: {
        marginTop: 20,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    checkboxLabel: {
        marginRight: 8,
    },
    checkbox: {
        padding: 8,
    },
});

export default DeliveryManagementPage;
