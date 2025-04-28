import React from "react";
import { View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import AppNavigator from "./lola/navigation/AppNavigator";
import appStyles from "./styles/appStyles"; // Ensure correct path
import { supabase } from "./lola/lib/supabase"; // Import Supabase client

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
