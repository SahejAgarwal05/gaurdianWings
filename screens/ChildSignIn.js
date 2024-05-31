import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, TextInput, Alert } from 'react-native';
import { app, db } from './firebaseConfig';
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { ref, get } from 'firebase/database';

const auth = getAuth(app);

const ChildSignIn = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    console.log('Component mounted');
    return () => {
      console.log('Component unmounted');
    };
  }, []);

  const checkUserRole = async (username, password) => {
    const userRef = ref(db, `child/${username}`);
    const snapshot = await get(userRef);
   // Alert.alert('Account created successfully!');
    if (snapshot.exists()) {
      const userData = snapshot.val();
      if (userData.password === password) {
        navigation.navigate('Dashboard');
      } else {
        Alert.alert('Error', 'Invalid password for Child account.');
        auth.signOut();
      }
    } else {
      Alert.alert('Error', 'Child account not found.');
      auth.signOut();
    }
  };

  const handleSignIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, `${username}@example.com`, password);
      console.log('User signed in successfully!');
      checkUserRole(username, password);
    } catch (error) {
      console.error('Authentication error:', error.message);
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Child Sign-In Page</Text>
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
      <Button title="Sign In" onPress={handleSignIn} />
    </View>
  );
};

export default ChildSignIn;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 10,
    borderRadius: 5,
    backgroundColor: 'white',
  },
});