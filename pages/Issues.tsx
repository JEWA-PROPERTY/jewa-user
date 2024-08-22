import React from 'react';
import { View, JewaText, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Issue = {
    id: string;
    status: string;
    type: string;
    location: string;
    subject: string;
    inquiry: string;
    timeslot: string;
    availableDate: string;
};
const IssueCard = ({ issue }: any) => (
    <View style={styles.issueCard}>
        <View style={styles.statusContainer}>
            <View style={styles.statusBadge}>
                <Ionicons
                    name={issue.status === 'Pending' ? 'alert-circle' : 'checkmark-circle'}
                    size={16}
                    color="white"
                />
                <JewaText style={styles.statusJewaText}>{issue.status}</JewaText>
            </View>
            <View style={styles.typeBadge}>
                <Ionicons name="settings" size={16} color="black" />
                <JewaText style={styles.typeJewaText}>{issue.type}</JewaText>
            </View>
        </View>
        <JewaText style={[styles.JewaText, styles.locationJewaText]}>{issue.location}</JewaText>
        <JewaText style={[styles.JewaText, styles.subjectJewaText]}>Inquiry Subject: {issue.subject}</JewaText>
        <JewaText style={[styles.JewaText, styles.inquiryJewaText]}>Inquiry: {issue.inquiry}</JewaText>
        <JewaText style={[styles.JewaText, styles.timeslotJewaText]}>Timeslot: {issue.timeslot}</JewaText>
        <JewaText style={[styles.JewaText, styles.availableDateJewaText]}>Available Date: {issue.availableDate}</JewaText>
    </View>
);

const IssuesReported = () => {
    return (
        <FlatList
            data={issues}
            renderItem={({ item }) => <IssueCard issue={item} />}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.issuesContainer}
        />
    );
};

const styles = StyleSheet.create({
    JewaText: {
        fontFamily: 'Nunito_400Regular',
    },
    issuesContainer: {
        padding: 16,
    },
    issueCard: {
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
        elevation: 3, // For shadow on Android
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    statusContainer: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FF4D4F', // Red color for Pending
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        marginRight: 8,
    },
    statusJewaText: {
        color: 'white',
        marginLeft: 4,
        fontWeight: 'bold',
    },
    typeBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#B0E0E6', // Light blue for General
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    typeJewaText: {
        color: 'black',
        marginLeft: 4,
        fontWeight: 'bold',
    },
    locationJewaText: {
        marginBottom: 8,
        fontWeight: 'bold',
    },
    subjectJewaText: {
        marginBottom: 4,
        fontWeight: 'bold',
    },
    inquiryJewaText: {
        marginBottom: 4,
        fontStyle: 'italic',
    },
    timeslotJewaText: {
        marginBottom: 4,
        color: '#555',
    },
    availableDateJewaText: {
        color: '#555',
    },
});

export default IssuesReported;
