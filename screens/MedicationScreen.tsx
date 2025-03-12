import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import CheckBox from 'expo-checkbox';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import styles from '../styles/styles';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface Medication {
  id: number;
  name: string;
  dosage: string;
  time: string;
  checked: boolean;
}

const MedicationScreen = () => {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [medName, setMedName] = useState('');
  const [medDosage, setMedDosage] = useState('');
  const [medTime, setMedTime] = useState('');

  useEffect(() => {
    const loadMedications = async () => {
      const storedMeds = await AsyncStorage.getItem('medications');
      if (storedMeds) setMedications(JSON.parse(storedMeds));
    };
    loadMedications();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem('medications', JSON.stringify(medications));
  }, [medications]);

  useEffect(() => {
    const requestPermissions = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Enable notifications for medication reminders.');
      }
    };
    requestPermissions();
  }, []);

  const handleCheck = (id: number) => {
    setMedications((prevMeds) =>
      prevMeds.map((med) =>
        med.id === id ? { ...med, checked: true } : med
      )
    );

    setTimeout(() => {
      setMedications((prevMeds) =>
        prevMeds.map((med) =>
          med.id === id ? { ...med, checked: false } : med
        )
      );
      scheduleNotification(medications.find(med => med.id === id)!);
    }, getNextMedicationTime(medications.find(m => m.id === id)!.time));
  };

  const getNextMedicationTime = (time: string) => {
    const [hour, minute] = time.split(':').map(Number);
    const now = new Date();
    const nextDose = new Date();
    nextDose.setHours(hour, minute, 0, 0);
    if (nextDose <= now) nextDose.setDate(nextDose.getDate() + 1);
    return nextDose.getTime() - now.getTime();
  };

  const scheduleNotification = async (med: Medication) => {
    const nextTime = getNextMedicationTime(med.time);
  
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Medication Reminder 💊',
        body: `Time to take ${med.name}, ${med.dosage}.`,
      },
      trigger: {
        seconds: nextTime / 1000,
        repeats: false,
      } as Notifications.TimeIntervalTriggerInput,
    });
  };

  const handleDelete = (id: number) => {
    Alert.alert('Delete Medication', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          setMedications(medications.filter(med => med.id !== id));
        },
      },
    ]);
  };

  const handleAddMedication = () => {
    if (!medName || !medDosage || !medTime) {
      Alert.alert('Error', 'Enter all medication details.');
      return;
    }
    const newMedication: Medication = {
      id: Date.now(),
      name: medName,
      dosage: medDosage,
      time: medTime,
      checked: false,
    };
    setMedications([...medications, newMedication]);
    setModalVisible(false);
    setMedName('');
    setMedDosage('');
    setMedTime('');
    scheduleNotification(newMedication);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Medications</Text>

      {medications.length === 0 ? (
        <Text style={styles.noMedsText}>No medications scheduled.</Text>
      ) : (
        <FlatList
          data={medications.filter(med => !med.checked)}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.medItem}>
              <CheckBox
                value={item.checked}
                onValueChange={() => handleCheck(item.id)}
                style={styles.checkbox}
              />
              <Text style={styles.medText}>
                {`${item.name}, ${item.dosage} - ${item.time}`}
              </Text>
              <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item.id)}>
                <Icon name="trash-can" size={24} color="white" />
              </TouchableOpacity>
            </View>
          )}
        />
      )}

      <TouchableOpacity style={styles.menuButton} onPress={() => setModalVisible(true)}>
        <Icon name="plus-circle" size={30} color="white" />
        <Text style={styles.buttonText}>Add Medication</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>Add Medication</Text>
            <TextInput style={styles.input} placeholder="Medication Name" value={medName} onChangeText={setMedName} />
            <TextInput style={styles.input} placeholder="Dosage (mg/tablets)" value={medDosage} onChangeText={setMedDosage} />
            <TextInput style={styles.input} placeholder="Time (HH:MM)" value={medTime} onChangeText={setMedTime} />

            <View style={styles.buttonRow}>
              <TouchableOpacity 
                style={[styles.cancelButton, { flex: 1, alignItems: 'center' }]} 
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
  
              <TouchableOpacity 
                style={[styles.menuButton, { flex: 1, alignItems: 'center' }]} 
                onPress={handleAddMedication}
              >
    <Text style={styles.buttonText}>Save</Text>
  </TouchableOpacity>
</View>

          </View>
        </View>
      </Modal>
    </View>
  );
};

export default MedicationScreen;
