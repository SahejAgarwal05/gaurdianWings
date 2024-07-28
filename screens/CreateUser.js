import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, TextInput, Alert, Image, TouchableOpacity } from 'react-native';
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { app, db } from './firebaseConfig';
import { ref, get, child, set, update } from 'firebase/database';
import { Picker } from '@react-native-picker/picker';

const auth = getAuth(app);

const CreateUser = ({ navigation }) => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Parent');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  const checkIfUserExists = async (username, email) => {
    const dbRef = ref(db);
    const parentSnapshot = await get(child(dbRef, `parent/${username}`));
    const childSnapshot = await get(child(dbRef, `child/${username}`));

    let emailExists = false;
    const parentEmailCheck = await get(child(dbRef, `parent`));
    const childEmailCheck = await get(child(dbRef, `child`));

    parentEmailCheck.forEach((snapshot) => {
      if (snapshot.val().email === email) {
        emailExists = true;
      }
    });

    childEmailCheck.forEach((snapshot) => {
      if (snapshot.val().email === email) {
        emailExists = true;
      }
    });

    return {
      usernameExists: parentSnapshot.exists() || childSnapshot.exists(),
      emailExists: emailExists,
    };
  };

  const handleCreateAccount = async () => {
    const trimmedName = name.trim();
    const trimmedUsername = username.trim();
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    const { usernameExists, emailExists } = await checkIfUserExists(trimmedUsername, trimmedEmail);

    if (usernameExists) {
      Alert.alert('Error', 'Username already exists. Please choose a different username.');
      return;
    }

    if (emailExists) {
      Alert.alert('Error', 'Email already exists. Please use a different email.');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, trimmedEmail, trimmedPassword);
      const userId = userCredential.user.uid;

      if (role === 'Parent') {
        const userRef = ref(db, `parent/${trimmedUsername}`);
        await set(userRef, {
          name: trimmedName,
          email: trimmedEmail,
          password: trimmedPassword,
          child: {},
          availableTime: 0,
        });
      } else if (role === 'Child') {
        const userRef = ref(db, `child/${trimmedUsername}`);
        await set(userRef, {
          name: trimmedName,
          email: trimmedEmail,
          password: trimmedPassword,
          parent: "",
          availableTime: 0, // Initialize available time
        });
      }

      console.log('User created successfully:', userCredential.user);
      Alert.alert('Account created successfully!', `Role: ${role}`);
      navigation.navigate('Welcome');
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        Alert.alert('Error', 'Email already in use. Please use a different email.');
      } else {
        console.error('Error creating account:', error.message);
        Alert.alert('Error', error.message);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../images/GuardianWingslogo.png')}
        style={styles.logo}
      />
      <Text style={styles.title}>Create Account</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your name"
        value={name}
        onChangeText={setName}
        autoCapitalize="words"
      />
      <TextInput
        style={styles.input}
        placeholder="Enter your username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
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
      <Text style={styles.label}>Select Role</Text>
      <Picker
        selectedValue={role}
        style={styles.picker}
        onValueChange={(itemValue) => setRole(itemValue)}
      >
        <Picker.Item label="Parent" value="Parent" />
        <Picker.Item label="Child" value="Child" />
      </Picker>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('CreateUser')}>
        <Text style={styles.buttonText}>Create Account</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CreateUser;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fefaf8',
  },
  logo: {
    width: 400,
    height: 200, // Adjust height according to the aspect ratio of your logo
    marginBottom: 60, // Space between the logo and buttons
    marginTop: 0,
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
  label: {
    width: '100%',
    marginBottom: 10,
    fontSize: 16,
  },
  picker: {
    width: '100%',
    height: 40,
    marginBottom: 20,
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
});
