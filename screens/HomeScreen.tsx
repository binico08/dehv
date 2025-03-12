import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import styles from '../styles/styles';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type RootStackParamList = {
  Companion: undefined;
  Medication: undefined;
  Emergency: undefined;
  Settings: undefined;
};

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Companion'>;
type HomeScreenRouteProp = RouteProp<RootStackParamList, 'Companion'>;

interface Props {
  navigation: HomeScreenNavigationProp;
  route: HomeScreenRouteProp;
}

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Home</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate('Companion')}>
          <Icon name="account-group" size={30} color="white" />
          <Text style={styles.buttonText}>Call Companion</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate('Medication')}>
          <Icon name="pill" size={30} color="white" />
          <Text style={styles.buttonText}>Medications</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.emergencyButton} onPress={() => navigation.navigate('Emergency')}>
          <Icon name="alert" size={30} color="white" />
          <Text style={styles.buttonText}>Emergency</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate('Settings')}>
          <Icon name="cog" size={30} color="white" />
          <Text style={styles.buttonText}>Settings</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HomeScreen;
