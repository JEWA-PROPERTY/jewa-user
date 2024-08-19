import React, { useState, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity, TextInput, Modal, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

import Colors from '../constants/Colors';
import JewaText from '../components/JewaText';
import { useUserStore } from '~/store/user-storage';

interface Alert {
  id: number;
  subject: string;
  description: string;
  status: 'Pending' | 'Closed' | 'Rejected';
  created_at: string;
}

function ManagementScreen() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [isResolvingAlert, setIsResolvingAlert] = useState(false);
  const [newStatus, setNewStatus] = useState<'Pending' | 'Closed' | 'Rejected'>('Pending');

  const user = useUserStore(state => state.user);

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      const response = await axios.post('https://jewapropertypro.com/infinity/api/getalerts', {
        resident_id: user?.userid
      });
      console.log('API Response:', response.data); // Log the response
      if (response.data) {
        setAlerts(response.data.message);
      } else {
        console.error('Unexpected API response structure:', response.data);
      }
    } catch (error) {
      console.error('Error fetching alerts:', error);
    }
  };

  const updateAlert = async (alertId: number, subject: string, description: string, status: string) => {
    try {
      await axios.post('https://jewapropertypro.com/infinity/api/updatealert', {
        alert_id: alertId,
        subject,
        description,
        status: newStatus
      });
      fetchAlerts(); // Refresh alerts after update
    } catch (error) {
      console.error('Error updating alert:', error);
    }
  };

  const renderAlert = (alert: Alert) => (
    <View key={alert.id} style={styles.alertItem}>
      <View style={styles.alertContent}>
        <JewaText style={styles.alertSubject}>{alert.subject}</JewaText>
        <JewaText style={styles.alertDescription}>{alert.description}</JewaText>
        <JewaText style={styles.alertStatus}>Status: {alert.status}</JewaText>
        <JewaText style={styles.alertDate}>Created: {new Date(alert.created_at).toLocaleDateString()}</JewaText>
      </View>
      <TouchableOpacity onPress={() => {
        setSelectedAlert(alert);
        setIsResolvingAlert(true);
        setNewStatus(alert.status);
      }}>
        <Ionicons name="settings-outline" size={24} color={Colors.primary} />
      </TouchableOpacity>
    </View>
  );

  const filteredAlerts = alerts?.filter(alert => 
    alert.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    alert.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.screenContainer}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search Alerts"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity style={styles.searchButton}>
          <Ionicons name="search" size={24} color={Colors.primary} />
        </TouchableOpacity>
      </View>
      <ScrollView>
        {filteredAlerts.map(renderAlert)}
      </ScrollView>

      <Modal
        visible={isResolvingAlert}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <JewaText style={styles.modalTitle}>{selectedAlert?.subject}</JewaText>
            <JewaText style={styles.modalDescription}>{selectedAlert?.description}</JewaText>
            <View style={styles.pickerContainer}>
              <JewaText>Status:</JewaText>
              {(['Pending', 'Closed', 'Rejected'] as const).map((status) => (
                <TouchableOpacity
                  key={status}
                  style={[styles.statusOption, newStatus === status && styles.selectedStatus]}
                  onPress={() => setNewStatus(status)}
                >
                  <JewaText style={newStatus === status ? styles.selectedStatusText : styles.statusOptionText}>
                    {status}
                  </JewaText>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity
              style={styles.updateButton}
              onPress={() => {
                if (selectedAlert) {
                  updateAlert(selectedAlert.id, selectedAlert.subject, selectedAlert.description, newStatus);
                  setIsResolvingAlert(false);
                }
              }}
            >
              <JewaText style={styles.updateButtonText}>Update</JewaText>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setIsResolvingAlert(false)}
            >
              <JewaText style={styles.closeButtonText}>Close</JewaText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    padding: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderColor: Colors.primary,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  searchButton: {
    padding: 8,
  },
  alertItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  alertContent: {
    flex: 1,
  },
  alertSubject: {
    fontSize: 18,
    fontFamily: 'Nunito_700Bold',
  },
  alertDescription: {
    fontSize: 14,
    color: Colors.gray,
  },
  alertStatus: {
    fontSize: 14,
    color: Colors.primary,
  },
  alertDate: {
    fontSize: 12,
    color: Colors.lightGray,
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
    borderRadius: 8,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 8,
    fontFamily: 'Nunito_600SemiBold',
  },
  modalDescription: {
    fontSize: 14,
    marginBottom: 16,
  },
  pickerContainer: {
    marginBottom: 16,
  },
  statusOption: {
    padding: 8,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 4,
    marginTop: 8,
  },
  selectedStatus: {
    backgroundColor: Colors.primary,
  },
  statusOptionText: {
    color: Colors.primary,
  },
  selectedStatusText: {
    color: 'white',
  },
  updateButton: {
    backgroundColor: Colors.primary,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 8,
  },
  updateButtonText: {
    color: 'white',
    fontSize: 16,
  },
  closeButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  closeButtonText: {
    color: Colors.primary,
    fontSize: 16,
  },
});

export default ManagementScreen;