import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import styles from '../styles/appStyles';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const EmergencyScreen: React.FC = () => {
  const [countdown, setCountdown] = useState<number | null>(null);
  const [calling, setCalling] = useState<string | null>(null);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (!isPaused && countdown !== null && countdown > 0) {
      const newTimer = setInterval(() => {
        setCountdown((prev) => (prev !== null && prev > 1 ? prev - 1 : 0));
      }, 1000);
      setTimer(newTimer);
      return () => clearInterval(newTimer);
    } else if (countdown === 0) {
      console.log(`Calling ${calling} now...`);
      setCountdown(null);
      setCalling(null);
      clearInterval(timer as NodeJS.Timeout);
      setTimer(null);
    }
  }, [countdown, isPaused]);

  const startEmergencyCall = (type: 'ambulance' | 'family') => {
    setCalling(type);
    setCountdown(3);
    setIsPaused(false);
  };

  const handleSafePress = () => {
    if (timer) clearInterval(timer); // Pause countdown
    setIsPaused(true);

    Alert.alert(
      "Stop Emergency Call?",
      "Are you sure you are safe and want to stop the call?",
      [
        {
          text: "No",
          style: "cancel",
          onPress: () => {
            setIsPaused(false); // Resume countdown if user selects "No"
          }
        },
        {
          text: "Yes",
          style: "destructive",
          onPress: () => {
            if (timer) {
              clearInterval(timer);
              setTimer(null);
            }
            setCountdown(null);
            setCalling(null);
            setIsPaused(false);

            Alert.alert("Call Stopped", "You have marked yourself as safe.");
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Emergency</Text>

      {countdown !== null ? (
        <View style={styles.callingContainer}>
          <Text style={styles.countdownTimer}>{countdown}</Text>
          <Text style={styles.callingText}>
            {calling === 'ambulance' ? `Calling Ambulance in ${countdown}...` : `Calling Family in ${countdown}...`}
          </Text>
          <TouchableOpacity style={styles.safeButton} onPress={handleSafePress}>
            <Text style={styles.buttonText}>I am Safe</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={{ width: '100%', alignItems: 'center', gap: 15 }}>
          <TouchableOpacity style={styles.emergencyButton} onPress={() => startEmergencyCall('ambulance')}>
            <Icon name="ambulance" size={30} color="white" />
            <Text style={styles.buttonText}>  Call an Ambulance</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.emergencyButton} onPress={() => startEmergencyCall('family')}>
            <Icon name="phone" size={30} color="white" />
            <Text style={styles.buttonText}>  Call your Family</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default EmergencyScreen;
