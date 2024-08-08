import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const issues = [
  {
    id: '1',
    status: 'Pending',
    type: 'General',
    subject: 'I have not received water for 2 days',
    inquiry: 'dddddsdss',
    timeslot: '02:37:00',
    availableDate: '2023-07-28',
    location: 'Busia',
  },
  {
    id: '2',
    status: 'Resolved',
    type: 'Technical',
    subject: 'Internet connection issue',
    inquiry: 'The connection is down',
    timeslot: '12:00:00',
    availableDate: '2023-07-25',
    location: 'Nairobi',
  },
  {
    id: '2',
    status: 'Resolved',
    type: 'Technical',
    subject: 'Internet connection issue',
    inquiry: 'The connection is down',
    timeslot: '12:00:00',
    availableDate: '2023-07-25',
    location: 'Nairobi',
  },
  {
    id: '2',
    status: 'Pending',
    type: 'Technical',
    subject: 'Internet connection issue',
    inquiry: 'The connection is down',
    timeslot: '12:00:00',
    availableDate: '2023-07-25',
    location: 'Nairobi',
  },
  {
    id: '2',
    status: 'Resolved',
    type: 'Technical',
    subject: 'Internet connection issue',
    inquiry: 'The connection is down',
    timeslot: '12:00:00',
    availableDate: '2023-07-25',
    location: 'Nairobi',
  },

];

const IssueCard = ({ issue }) => (
  <View style={styles.issueCard}>
    <View style={styles.statusContainer}>
      <View style={styles.statusBadge}>
        <Ionicons
          name={issue.status === 'Pending' ? 'alert-circle' : 'checkmark-circle'}
          size={16}
          color="white"
        />
        <Text style={styles.statusText}>{issue.status}</Text>
      </View>
      <View style={styles.typeBadge}>
        <Ionicons name="settings" size={16} color="black" />
        <Text style={styles.typeText}>{issue.type}</Text>
      </View>
    </View>
    <Text style={styles.locationText}>{issue.location}</Text>
    <Text style={styles.subjectText}>Inquiry Subject: {issue.subject}</Text>
    <Text style={styles.inquiryText}>Inquiry: {issue.inquiry}</Text>
    <Text style={styles.timeslotText}>Timeslot: {issue.timeslot}</Text>
    <Text style={styles.availableDateText}>Available Date: {issue.availableDate}</Text>
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
  statusText: {
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
  typeText: {
    color: 'black',
    marginLeft: 4,
    fontWeight: 'bold',
  },
  locationText: {
    marginBottom: 8,
    fontWeight: 'bold',
  },
  subjectText: {
    marginBottom: 4,
    fontWeight: 'bold',
  },
  inquiryText: {
    marginBottom: 4,
    fontStyle: 'italic',
  },
  timeslotText: {
    marginBottom: 4,
    color: '#555',
  },
  availableDateText: {
    color: '#555',
  },
});

export default IssuesReported;
