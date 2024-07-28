import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Alert, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { app, db } from './firebaseConfig.js';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { ref, get } from 'firebase/database';
import AsyncStorage from '@react-native-async-storage/async-storage';
const auth = getAuth(app);

const ParentSignIn = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  const handleSignIn = async () => {
    try {
      const trimmedUsername = username.trim();
      const trimmedPassword = password.trim();
      const userRef = ref(db, `parent/${trimmedUsername}`);
      const snapshot = await get(userRef);
      if (snapshot.exists()) {
        const userData = snapshot.val();
        if (userData.password === trimmedPassword) {
          const userToSave = { username: trimmedUsername, type: 'parent' };
          await AsyncStorage.setItem('user', JSON.stringify(userToSave));
          navigation.navigate('ParentDashboard', { username: trimmedUsername, navigation: navigation });
        } else {
          Alert.alert('Error', 'Invalid password for Parent account.');
        }
      } else {
        Alert.alert('Error', 'Parent account not found.');
      }
    } catch (error) {
      console.error('Error signing in:', error.message);
      Alert.alert('Error', error.message);
    }
  };


  return (
    <View style={styles.container}>
      <Image
        source={require('../images/GuardianWingslogo.png')}
        style={styles.logo}
      />
      <Text style={styles.title}>Parent Sign-In</Text>
      <TextInput
        style={styles.input}
        value={username}
        placeholder='Enter your username'
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Enter your password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
      />
      <TouchableOpacity style={styles.button} onPress={handleSignIn}>
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ParentSignIn;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fefaf8',
  },
  logo: {
    width: 400,
    height: 400, // Adjust height according to the aspect ratio of your logo
    marginBottom: 40, // Space between the logo and buttons
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    width: '85%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 10,
    borderRadius: 5,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
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
    fontWeight: 'bold',
  },
});


