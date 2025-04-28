import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { useNavigation, NavigationProp, RouteProp, useRoute } from "@react-navigation/native";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { supabase } from "../lib/supabase"; 
import registrationStyles from "../styles/registrationStyles";

type RootStackParamList = {
  OTP: { phone: string };
  ProfileScreen: undefined;
};

type OTPScreenRouteProp = RouteProp<RootStackParamList, "OTP">;

const OTPScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute<OTPScreenRouteProp>();
  const { phone } = route.params;

  const [otp, setOtp] = useState("");
  const [timeLeft, setTimeLeft] = useState(60);
  const [isResendActive, setIsResendActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  // Countdown timer for resend code
  useEffect(() => {
    if (timeLeft <= 0) {
      setIsResendActive(true);
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft]);

  // Format time for display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" + secs : secs}`;
  };

  // Handle OTP change
  const handleOtpChange = (text: string) => {
    // Only allow numbers
    const numericValue = text.replace(/[^0-9]/g, "");
    setOtp(numericValue);
  };

  // Handle resend code
  const handleResendCode = () => {
    if (!isResendActive) return;

    // Here we would call Supabase's resend phone OTP
    // For now, just reset the timer
    setTimeLeft(60);
    setIsResendActive(false);
    Alert.alert("Code Sent", "A new verification code has been sent to your phone.");
  };

  // Handle verification
  const handleVerify = async () => {
    setIsPressed(true);

    try {
      if (otp.length !== 6) {
        Alert.alert("Invalid Code", "Please enter a valid 6-digit code.");
        setIsPressed(false);
        return;
      }

      setLoading(true);
      
      // In a real implementation, we would verify the OTP with Supabase
      // For demo purposes, we'll accept any 6-digit code

      // Check if user already exists to prevent duplicates
      const { data: existingUser, error: fetchError } = await supabase
        .from('users')
        .select('id')
        .eq('phone_number', "+63" + phone)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

      if (!existingUser) {
        // Create a user record in Supabase
        const { data, error } = await supabase
          .from('users')
          .insert([
            { 
              phone_number: "+63" + phone,
              verified: true,
              created_at: new Date().toISOString()
            }
          ]);
          
        if (error) throw error;
      }
      
      // Navigate to profile setup
      navigation.navigate("ProfileScreen");
      
    } catch (error: any) {
      Alert.alert("Verification Failed", error.message || "Please try again.");
      console.error("OTP verification error:", error);
    } finally {
      setLoading(false);
      setIsPressed(false);
    }
  };

  return (
    <View style={registrationStyles.container}>
      <TouchableOpacity style={registrationStyles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>

      <View style={registrationStyles.whiteBox}>
        <Image source={require("../assets/Logo.png")} style={registrationStyles.logo} />

        {/* Progress Indicator */}
        <View style={registrationStyles.progressContainer}>
          <View style={registrationStyles.progressDotActive} />
          <View style={registrationStyles.progressLine} />
          <View style={registrationStyles.progressDotActive} />
          <View style={registrationStyles.progressLine} />
          <View style={registrationStyles.progressDot} />
        </View>

        <Text style={registrationStyles.title}>Verify Phone</Text>
        <Text style={registrationStyles.subtitle}>
          We've sent a verification code to your phone number +63 {phone}
        </Text>

        {/* Phone Status */}
        <View style={registrationStyles.phoneConfirmBox}>
          <View>
            <Text style={registrationStyles.phoneText}>+63 {phone}</Text>
            <Text style={registrationStyles.phoneStatus}>Awaiting verification</Text>
          </View>
          <TouchableOpacity
            style={registrationStyles.editButton}
            onPress={() => navigation.goBack()}
          >
            <MaterialIcons name="edit" size={20} color="#007AFF" />
          </TouchableOpacity>
        </View>

        {/* OTP Input */}
        <Text style={registrationStyles.label}>Enter verification code</Text>
        <TextInput
          style={registrationStyles.otpInput}
          keyboardType="number-pad"
          value={otp}
          onChangeText={handleOtpChange}
          maxLength={6}
          placeholder="123456"
        />

        {/* Resend Code */}
        <TouchableOpacity
          style={registrationStyles.resendButton}
          onPress={handleResendCode}
          disabled={!isResendActive}
        >
          <MaterialIcons
            name="refresh"
            size={18}
            color={isResendActive ? "#007AFF" : "#CCC"}
          />
          <Text
            style={[
              registrationStyles.resendText,
              { color: isResendActive ? "#007AFF" : "#CCC" },
            ]}
          >
            {isResendActive
              ? "Resend code"
              : `Resend code in ${formatTime(timeLeft)}`}
          </Text>
        </TouchableOpacity>

        {/* Confirm Button */}
        <TouchableOpacity
          style={[
            registrationStyles.confirmButton,
            otp.length === 6 && registrationStyles.confirmButtonActive,
            isPressed && registrationStyles.buttonPressed,
            loading && { opacity: 0.7 }
          ]}
          onPress={handleVerify}
          disabled={otp.length !== 6 || loading}
        >
          <Text
            style={[
              registrationStyles.confirmButtonText,
              otp.length === 6 && { color: "#FFF" },
            ]}
          >
            {loading ? "Verifying..." : "Verify"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default OTPScreen;