import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import styles from "../styles/styles"; // Ensure you have this style file

const EmergencyScreen: React.FC = () => {
  const [countdown, setCountdown] = useState<number | null>(null);
  const [calling, setCalling] = useState<string | null>(null);

  const startEmergencyCall = (type: "ambulance" | "family") => {
    setCalling(type);
    setCountdown(3);

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev !== null && prev > 1) {
          return prev - 1;
        } else {
          clearInterval(timer);
          console.log(`Calling ${type} now...`);
          return null;
        }
      });
    }, 1000);
  };

  const cancelCall = () => {
    setCountdown(null);
    setCalling(null);
    console.log("Call canceled. User is safe.");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Emergency</Text>

      {countdown !== null ? (
        <View style={styles.callingContainer}>
          <Text style={styles.countdown}>{countdown}</Text>
          <Text style={styles.callingText}>
            Calling {calling} in {countdown}...
          </Text>
          <TouchableOpacity style={styles.safeButton} onPress={cancelCall}>
            <Text style={styles.buttonText}>I am Safe</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View>
          <TouchableOpacity
            style={styles.emergencyButton}
            onPress={() => startEmergencyCall("ambulance")}
          >
            <Text style={styles.buttonText}>Call an Ambulance</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.emergencyButton}
            onPress={() => startEmergencyCall("family")}
          >
            <Text style={styles.buttonText}>Call your Family</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default EmergencyScreen;
