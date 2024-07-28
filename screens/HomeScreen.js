import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen({ navigation }) {
  const checkLoggedIn = async () => {
      try {
        const savedUser = await AsyncStorage.getItem('user');
        if (savedUser && JSON.parse(savedUser).type === 'child') { 
          navigation.navigate('ChildDashboard', { username: JSON.parse(savedUser).username });
        }
        else if (savedUser && JSON.parse(savedUser).type === 'parent') {
          navigation.navigate('ParentDashboard', { username: JSON.parse(savedUser).username });
        }
      } catch (error) {
        console.error('Error retrieving user from AsyncStorage:', error.message);
      }
    };

    checkLoggedIn();
  return (
    
    <View style={styles.container}>
      <Image
        source={require('../images/GuardianWingslogo.png')}
        style={styles.logo}
      />
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('ParentSignIn')}>
        <Text style={styles.buttonText}>Parent Sign in</Text>
      </TouchableOpacity>
      <View style={styles.spacer} />
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('ChildSignIn')}>
        <Text style={styles.buttonText}>Child Sign in</Text>
      </TouchableOpacity>
      <View style={styles.spacer} />
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('CreateUser')}>
        <Text style={styles.buttonText}>Create Account</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#fefaf8', // Background color to match the design
    paddingTop: 0,
  },
  logo: {
    width: 400,
    height: 400, // Adjust height according to the aspect ratio of your logo
    marginBottom: 60, // Space between the logo and buttons
    marginTop: 0,
  },
  button: {
    backgroundColor: '#ffffff', // White background to match the design
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%', // Width of the button
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 1, // Shadow for Android
  },
  buttonText: {
    color: '#000',
    fontSize: 16,
  },
  spacer: {
    height: 20, // Space between buttons
  },
});
