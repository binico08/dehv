import React, { useState, useRef, useEffect } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Image, 
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions,
  InputAccessoryView
} from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { MaterialIcons, FontAwesome } from "@expo/vector-icons";
import { supabase } from "../lib/supabase"; // Adjust the import path as necessary
import registrationStyles from "../styles/registrationStyles";

type RootStackParamList = {
  OTP: { phone: string };
};

const RegisterScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const inputRef = useRef<TextInput>(null);
  const inputAccessoryViewID = "phoneInputAccessoryView";
  
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");
  const [showPrivacy, setShowPrivacy] = useState(true);
  const [isPressed, setIsPressed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  
  // Handle keyboard showing/hiding
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => setKeyboardVisible(true)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => setKeyboardVisible(false)
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  // Validate Phone Number
  const validatePhoneNumber = (text: string) => {
    setPhoneNumber(text);

    if (text.length === 0) {
      setError("");
    } else if (!/^(9\d{9})$/.test(text)) {
      setError("Phone number must be 10 digits and start with 9.");
    } else {
      setError("");
    }
  };

  // Create a new user in Supabase
  const checkUserExists = async (phone: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('phone_number')
        .eq('phone_number', '+63' + phone)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      
      return !!data;
    } catch (error) {
      console.error('Error checking user:', error);
      return false;
    }
  };

  // Handle Send Code
  const handleSendCode = async () => {
    Keyboard.dismiss(); // Dismiss keyboard when button is pressed
    setIsPressed(true);
    
    try {
      if (!phoneNumber || !/^(9\d{9})$/.test(phoneNumber)) {
        setError("Phone number must be 10 digits and start with 9.");
        setIsPressed(false);
        return;
      }
      
      setLoading(true);
      
      // Check if user exists
      const userExists = await checkUserExists(phoneNumber);
      
      if (userExists) {
        Alert.alert(
          "Account Exists", 
          "This phone number is already registered.",
          [{ text: "OK" }]
        );
        setLoading(false);
        setIsPressed(false);
        return;
      }

      // If using OTP via Supabase Auth, we would call that here
      // For now, we'll just navigate to OTP screen
      navigation.navigate("OTP", { phone: phoneNumber });
      
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to send code");
      console.error(error);
    } finally {
      setLoading(false);
      setIsPressed(false);
    }
  };

  // Function to add a "Done" button to close the keyboard
  const renderInputAccessory = () => {
    if (Platform.OS !== 'ios') return null;
    
    return (
      <InputAccessoryView nativeID={inputAccessoryViewID}>
        <View style={{
          backgroundColor: '#f1f1f1',
          padding: 8,
          flexDirection: 'row',
          justifyContent: 'flex-end',
          borderTopWidth: 1,
          borderTopColor: '#ccc'
        }}>
          <TouchableOpacity 
            onPress={() => {
              Keyboard.dismiss();
            }}
            style={{
              padding: 8,
              marginRight: 8
            }}
          >
            <Text style={{ color: '#007AFF', fontSize: 16, fontWeight: '600' }}>Done</Text>
          </TouchableOpacity>
        </View>
      </InputAccessoryView>
    );
  };

  return (
    <>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 20 : 0}
      >
        <TouchableWithoutFeedback onPress={() => {
          Keyboard.dismiss();
          if (inputRef.current) {
            inputRef.current.blur();
          }
        }}>
          <ScrollView 
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={registrationStyles.container}>
              {/* White Box Container */}
              <View style={registrationStyles.whiteBox}>
                <Image source={require("../assets/Logo.png")} style={registrationStyles.logo} />

                {/* Progress Indicator */}
                <View style={registrationStyles.progressContainer}>
                  <View style={registrationStyles.progressDotActive} />
                  <View style={registrationStyles.progressLine} />
                  <View style={registrationStyles.progressDot} />
                  <View style={registrationStyles.progressLine} />
                  <View style={registrationStyles.progressDot} />
                </View>

                {/* Title */}
                <Text style={registrationStyles.title}>Registration</Text>
                <Text style={registrationStyles.subtitle}>
                  Fill in the registration data. It will take a couple of minutes. All you need is a phone number.
                </Text>

                {/* Privacy Notice */}
                {showPrivacy && (
                  <View style={registrationStyles.privacyContainer}>
                    <FontAwesome name="lock" size={16} color="#666" />
                    <Text style={registrationStyles.privacyText}>
                      We take privacy issues seriously. Your personal data is securely protected.
                    </Text>
                    <TouchableOpacity onPress={() => setShowPrivacy(false)}>
                      <MaterialIcons name="close" size={18} color="#666" />
                    </TouchableOpacity>
                  </View>
                )}

                {/* Phone Input */}
                <Text style={registrationStyles.label}>Enter your phone number</Text>
                <View style={registrationStyles.phoneInputContainer}>
                  <Text style={registrationStyles.prefix}>+63</Text>
                  <TextInput
                    ref={inputRef}
                    style={[registrationStyles.phoneInput, error ? registrationStyles.inputError : null]}
                    keyboardType="numeric"
                    maxLength={10}
                    placeholder="9XXXXXXXXX"
                    value={phoneNumber}
                    onChangeText={validatePhoneNumber}
                    editable={!loading}
                    returnKeyType="done"
                    onSubmitEditing={() => Keyboard.dismiss()}
                    blurOnSubmit={true}
                    inputAccessoryViewID={Platform.OS === 'ios' ? inputAccessoryViewID : undefined}
                    enablesReturnKeyAutomatically={true}
                  />
                </View>

                {error && <Text style={registrationStyles.errorText}>{error}</Text>}

                {/* Send Code Button */}
                <TouchableOpacity
                  style={[
                    registrationStyles.sendButton, 
                    isPressed ? registrationStyles.sendButtonPressed : null,
                    loading ? { opacity: 0.7 } : null
                  ]}
                  onPress={handleSendCode}
                  disabled={loading}
                >
                  <Text style={registrationStyles.sendButtonText}>
                    {loading ? "Sending..." : "Send Code"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
      
      {/* Render the input accessory view with Done button (iOS only) */}
      {Platform.OS === 'ios' && renderInputAccessory()}
    </>
  );
};

export default RegisterScreen;