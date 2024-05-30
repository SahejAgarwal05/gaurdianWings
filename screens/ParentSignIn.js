import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, TextInput} from 'react-native';
import { app } from './firebaseConfig';
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';

const auth = getAuth(app)

const ParentSignIn = ({ navigation }) => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const ws = new WebSocket('ws://your-server-url');

    ws.onopen = () => {
      console.log('connected');
      ws.send('Parent connected');
    };

    ws.onmessage = (e) => {
      console.log('Message:', e.data);
    };

    return () => {
      ws.close();
    };
  }, []);

  const handleSignIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log('User signed in successfully!');
      navigation.navigate('Dashboard');
    } catch (error) {
      console.error('Authentication error:', error.message);
    }
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Parent Sign-In Page</Text>
      <TextInput
        style={styles.input}
        value={email}
        placeholder='Enter your email'
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
      <Button title="Sign In" onPress={handleSignIn} />
    </View>
  );
}

export default ParentSignIn

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding : 20
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
