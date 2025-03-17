import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome5, MaterialIcons, AntDesign } from "@expo/vector-icons";
import appStyles from "../styles/appStyles"; // Import the styles

const SettingsScreen: React.FC = () => {
  const navigation = useNavigation();

  return (
    <View style={appStyles.container}>


      {/* Title */}
      <Text style={appStyles.title}>Settings</Text>

      {/* Profile Icon */}
      <FontAwesome5 name="user-circle" size={80} color="red" style={appStyles.profileIcon} />
      <Text style={appStyles.username}>User</Text>

      {/* Settings Options */}
      <View style={appStyles.optionsContainer}>
        <OptionButton
          icon={<FontAwesome5 name="user-edit" size={20} color="red" />}
          text="Edit Profile"
          onPress={() => navigation.navigate("Profile")}
        />
        <OptionButton
          icon={<MaterialIcons name="phone" size={20} color="red" />}
          text="Edit Emergency Contact"
          onPress={() => navigation.navigate("EmergencyContactScreen")}
        />
        <OptionButton
          icon={<FontAwesome5 name="pills" size={20} color="red" />}
          text="Edit Medications"
          onPress={() => navigation.navigate("Medications")}
        />
        <OptionButton
          icon={<AntDesign name="lock" size={20} color="red" />}
          text="Password"
          onPress={() => navigation.navigate("Password")}
        />
        <OptionButton
          icon={<MaterialIcons name="palette" size={20} color="red" />}
          text="Personalization"
          onPress={() => navigation.navigate("  Personalization")}
        />
      </View>
    </View>
  );
};

// 🔹 Reusable Option Button Component
const OptionButton = ({ icon, text, onPress }) => (
  <TouchableOpacity style={appStyles.optionButton} onPress={onPress}>
    {icon}
    <Text style={appStyles.optionText}>{text}</Text>
  </TouchableOpacity>
);

export default SettingsScreen;
