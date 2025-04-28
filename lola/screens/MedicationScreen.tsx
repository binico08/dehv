import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
  Modal,
  Alert,
} from "react-native";
import CheckBox from "expo-checkbox";
import DateTimePicker from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import styles from "../styles/appStyles";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

interface Medication {
  id: number;
  name: string;
  dosage: string;
  date: string;
  time: string;
  checked: boolean;
}

const MedicationScreen = () => {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [medName, setMedName] = useState("");
  const [medDosage, setMedDosage] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  // Load Medications from AsyncStorage
  useEffect(() => {
    const loadMedications = async () => {
      const storedMeds = await AsyncStorage.getItem("medications");
      if (storedMeds) setMedications(JSON.parse(storedMeds));
    };
    loadMedications();
  }, []);

  // Save Medications to AsyncStorage whenever they change
  useEffect(() => {
    AsyncStorage.setItem("medications", JSON.stringify(medications));
  }, [medications]);

  // Request Notification Permission
  useEffect(() => {
    const requestPermissions = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Enable notifications for medication reminders.");
      }
    };
    requestPermissions();
  }, []);

  // Handle Date Selection
  const onDateChange = (event: any, date?: Date) => {
    setShowDatePicker(false);
    if (date) setSelectedDate(date);
  };

  // Handle Time Selection
  const onTimeChange = (event: any, time?: Date) => {
    setShowTimePicker(false);
    if (time) setSelectedTime(time);
  };

  // Schedule Medication Reminder
  const scheduleNotification = async (med: Medication) => {
    const notificationTime = new Date(`${med.date} ${med.time}`);

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Medication Reminder",
        body: `Time to take ${med.name}, ${med.dosage}.`,
      },
      trigger: { date: notificationTime },
    });
  };

  // Add Medication
  const handleAddMedication = () => {
    if (!medName || !medDosage || !selectedDate || !selectedTime) {
      Alert.alert("Error", "Enter all medication details.");
      return;
    }

    const formattedDate = selectedDate.toISOString().split("T")[0];
    const formattedTime = selectedTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true });

    const newMedication: Medication = {
      id: Date.now(),
      name: medName,
      dosage: medDosage,
      date: formattedDate,
      time: formattedTime,
      checked: false,
    };

    setMedications([...medications, newMedication]);
    setModalVisible(false);
    setMedName("");
    setMedDosage("");
    setSelectedDate(null);
    setSelectedTime(null);
    scheduleNotification(newMedication);
  };

  // Handle Checkbox Click
  const handleCheck = (id: number) => {
    setMedications((prevMeds) =>
      prevMeds.map((med) => (med.id === id ? { ...med, checked: !med.checked } : med))
    );
  };

  // Delete Medication
  const handleDelete = (id: number) => {
    setMedications(medications.filter((med) => med.id !== id));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Medications</Text>

      {medications.length === 0 ? (
        <Text style={styles.noMedsText}>No medications scheduled.</Text>
      ) : (
        <FlatList
          data={medications}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.medItem}>
              <CheckBox
                value={item.checked}
                onValueChange={() => handleCheck(item.id)}
                style={styles.checkbox}
              />
              <Text style={styles.medText}>{`${item.name}, ${item.dosage} - ${item.date} at ${item.time}`}</Text>
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

      {/* Medication Input Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>Add Medication</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Medication Name"
              value={medName}
              onChangeText={setMedName}
            />
            <TextInput
              style={styles.input}
              placeholder="Dosage (mg/tablets)"
              value={medDosage}
              onChangeText={setMedDosage}
              keyboardType="numeric"
            />

            {/* Date Picker */}
            <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}>
              <Text>{selectedDate ? selectedDate.toDateString() : "Select Date"}</Text>
            </TouchableOpacity>
            {showDatePicker && <DateTimePicker value={new Date()} mode="date" display="default" onChange={onDateChange} />}

            {/* Time Picker */}
            <TouchableOpacity style={styles.input} onPress={() => setShowTimePicker(true)}>
              <Text>{selectedTime ? selectedTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true }) : "Select Time"}</Text>
            </TouchableOpacity>
            {showTimePicker && <DateTimePicker value={new Date()} mode="time" display="default" onChange={onTimeChange} />}

            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.saveButton} onPress={handleAddMedication}>
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
