import React from "react";
import { View, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import AppNavigator from "./navigation/AppNavigator";
import appStyles from "./styles/appStyles"; // Ensure correct path


const App: React.FC = () => {
  return (
    <View style={{ flex: 1 }}> 
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </View>
  );
};

export default App;
