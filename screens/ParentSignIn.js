import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Alert, Image, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
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
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.innerContainer}>
        <View style={styles.inner}>
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
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ParentSignIn;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fefaf8',
  },
  innerContainer: {
    flexGrow: 1,
    justifyContent: 'center', // Center content vertically
    alignItems: 'center',
    padding: 20,
  },
  inner: {
    width: '100%',
    maxWidth: 400, // Optional: Set a max width for better layout control
    alignItems: 'center',
  },
  logo: {
    width: '100%',
    height: 200, // Adjust the height of the logo
    marginBottom: 20, // Space between the logo and the rest of the content
  },
  title: {
    fontSize: 24,
    marginBottom: 10, // Space below the title
    textAlign: 'center',
  },
  input: {
    width: '85%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10, // Space between inputs
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
