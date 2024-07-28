import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { ref, set, get } from 'firebase/database';
import { db } from './firebaseConfig';

const AddChildScreen = ({ route, navigation }) => {
  const { username: parentUsername } = route.params; // Get parent's username from navigation params
  const [childUsername, setChildUsername] = useState('');
  const [childPassword, setChildPassword] = useState('');

  const handleAddChild = async () => {
    const trimmedChildUsername = childUsername.trim();
    const trimmedChildPassword = childPassword.trim();

    if (!trimmedChildUsername || !trimmedChildPassword) {
      Alert.alert('Error', 'Both username and password are required.');
      return;
    }

    try {
      const childRef = ref(db, `child/${trimmedChildUsername}`);
      const childSnapshot = await get(childRef);

      if (childSnapshot.exists()) {
        const childData = childSnapshot.val();
        if (childData.password !== trimmedChildPassword) {
          Alert.alert('Error', 'Incorrect password for the child account.');
          return;
        }

        if (childData.parent && childData.parent !== "") {
          if (childData.parent === parentUsername) {
            Alert.alert('Error', 'This child is already assigned to you.');
          } else {
            Alert.alert('Error', `This child is already assigned to another parent: ${childData.parent}.`);
          }
          return;
        }

        // Update child's parent field
        await set(ref(db, `child/${trimmedChildUsername}/parent`), parentUsername);

        // Add child to parent's children list
        const parentChildRef = ref(db, `parent/${parentUsername}/Children/${trimmedChildUsername}`);
        await set(parentChildRef, true);

        Alert.alert('Success', 'Child added successfully!');
        navigation.goBack();
        navigation.navigate('ParentDashboard', { username: parentUsername });
      } else {
        Alert.alert('Error', 'Child account does not exist.');
      }
    } catch (error) {
      console.error('Error adding child:', error.message);
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Child</Text>
      <TextInput
        style={styles.input}
        placeholder="Child Username"
        value={childUsername}
        onChangeText={setChildUsername}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Child Password"
        value={childPassword}
        onChangeText={setChildPassword}
        secureTextEntry
        autoCapitalize="none"
      />
      <Button title="Add Child" onPress={handleAddChild} />
    </View>
  );
};

export default AddChildScreen;

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