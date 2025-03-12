import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import styles from '../styles/styles';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type RootStackParamList = { Home: undefined };
type CompanionScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

interface Props {
  navigation: CompanionScreenNavigationProp;
}

const CompanionScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Call Your Companion</Text>

      <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate('Home')}>
        <Icon name="arrow-left" size={30} color="white" />
        <Text style={styles.buttonText}>Back to Home</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CompanionScreen;
