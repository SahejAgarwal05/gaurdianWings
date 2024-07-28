import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { ref, get, set } from 'firebase/database';
import { db } from './firebaseConfig';

const RemoveChildScreen = ({ route, navigation }) => {
  const parentUsername = route.params.username; // Get parent's username from navigation params
  const [childUsername, setChildUsername] = useState('');
   const [parentPassword, setParentPassword] = useState('');
   console.log(parentUsername); 
  const handleRemoveChild = async () => {
    const trimmedChildUsername = childUsername.trim();
    const trimmedParentPassword = parentPassword.trim();

    if (!trimmedChildUsername || !trimmedParentPassword) {
      Alert.alert('Error', 'Both child username and parent password are required.');
      return;
    }

    try {
      // Verify parent's password
      const parentRef = ref(db, `parent/${parentUsername}`);
      const parentSnapshot = await get(parentRef);

      if (parentSnapshot.exists()) {
        const parentData = parentSnapshot.val();
        if (parentData.password !== trimmedParentPassword) {
          Alert.alert('Error', 'Incorrect password for the parent account.');
          return;
        }

        // Proceed to remove child
        const childRef = ref(db, `child/${trimmedChildUsername}`);
        const childSnapshot = await get(childRef);

        if (childSnapshot.exists()) {
          let childData = childSnapshot.val();
          
          if (childData.hasOwnProperty('parent') && childData.parent === parentUsername) {
            // Remove parent field from child
            childData.parent = ' n ';
            await set(childRef, childData);

            // Remove child from parent's children list
            const parentChildRef = ref(db, `parent/${parentUsername}/Children/${trimmedChildUsername}`);
            await set(parentChildRef, null);

            Alert.alert('Success', 'Child removed successfully!');
            navigation.goBack();
            navigation.navigate('ParentDashboard', { username: parentUsername });
          } else {
            Alert.alert('Error', 'This child is not assigned to you.');
          }
        } else {
          Alert.alert('Error', 'Child account does not exist.');
        }
      } else {
        Alert.alert('Error', 'Parent account does not exist.');
      }
    } catch (error) {
      console.error('Error removing child:', error.message);
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Remove Child</Text>
      <TextInput
        style={styles.input}
        placeholder="Child Username"
        value={childUsername}
        onChangeText={setChildUsername}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Parent Password"
        value={parentPassword}
        onChangeText={setParentPassword}
        secureTextEntry
        autoCapitalize="none"
      />
      <Button title="Remove Child" onPress={handleRemoveChild} />
    </View>
  );
};

export default RemoveChildScreen;

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
