import React, { useEffect, useState } from 'react'
import { View, Text, Button, StyleSheet, TextInput } from 'react-native'
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth'
import { app } from './firebaseConfig'

const auth = getAuth(app)

const CreateUser = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [user, setUser] = useState(null)

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          setUser(user);
        });
    
        return () => unsubscribe();
      }, [auth]);
  
    const handleCreateAccount = async () => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            console.log('User created successfully:', userCredential.user);
            navigation.navigate('HomeScreen'); // Navigate to the Dashboard screen on success
          } catch (error) {
            console.error('Error creating account:', error.message);
          }
    };

    return (
        <View style={styles.container}>
          <Text style={styles.title}>Create Account</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter you email"
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
          <Button title="Create Account" onPress={handleCreateAccount} />
        </View>
      );
    }

    export default CreateUser

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