import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from '../styles/styles';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const EmergencyScreen: React.FC = () => {
  const [countdown, setCountdown] = useState<number | null>(null);
  const [calling, setCalling] = useState<string | null>(null);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (countdown !== null && countdown > 0) {
      const newTimer = setInterval(() => {
        setCountdown((prev) => (prev !== null && prev > 1 ? prev - 1 : 0));
      }, 1000);
      setTimer(newTimer);
      return () => clearInterval(newTimer);
    } else if (countdown === 0) {
      console.log(`Calling ${calling} now...`);
      setCountdown(null);
      setCalling(null);
    }
  }, [countdown]);

  const startEmergencyCall = (type: 'ambulance' | 'family') => {
    setCalling(type);
    setCountdown(3);
  };

  const cancelCall = () => {
    if (timer) clearInterval(timer);
    setCountdown(null);
    setCalling(null);
    console.log('Call canceled. User is safe.');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Emergency</Text>

      {countdown !== null ? (
        <View style={styles.callingContainer}>
          <Text style={styles.countdown}>{countdown}</Text>
          <Text style={styles.callingText}>Calling {calling} in {countdown}...</Text>
          <TouchableOpacity style={styles.safeButton} onPress={cancelCall}>
            <Text style={styles.buttonText}>I am Safe</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={{ width: '100%', alignItems: 'center', gap: 15 }}>
          <TouchableOpacity style={styles.emergencyButton} onPress={() => startEmergencyCall('ambulance')}>
            <Icon name="ambulance" size={30} color="white" />
            <Text style={styles.buttonText}>Call an Ambulance</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.emergencyButton} onPress={() => startEmergencyCall('family')}>
            <Icon name="phone" size={30} color="white" />
            <Text style={styles.buttonText}>Call your Family</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default EmergencyScreen;
