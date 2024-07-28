import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ref, get } from 'firebase/database';
import { db } from './firebaseConfig';
import { useIsFocused } from '@react-navigation/native';

const ParentSettings = ({ route, navigation, parentNavigation, parentUsername }) => {
  const [children, setChildren] = useState([]);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (!parentUsername) {
      console.error('Parent username is not defined');
      return;
    }

    const fetchChildren = async () => {
      try {
        const childrenRef = ref(db, `users/${parentUsername}/children`);
        const snapshot = await get(childrenRef);
        if (snapshot.exists()) {
          setChildren(Object.values(snapshot.val()));
        } else {
          console.log('No children found');
        }
      } catch (error) {
        console.error('Error fetching children:', error);
      }
    };

    if (isFocused) {
      fetchChildren();
    }
  }, [isFocused, parentUsername]);

  const handleAddChild = () => {
    parentNavigation.navigate('AddChildScreen', { username: parentUsername });
  };

  const handleRemoveChild = () => {
    parentNavigation.navigate('RemoveChildScreen', { username: parentUsername });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      {children.map((child, index) => (
        <Text key={index}>{child.name}</Text>
      ))}
      <TouchableOpacity style={styles.button} onPress={handleAddChild}>
        <Text style={styles.buttonText}>Add Child</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleRemoveChild}>
        <Text style={styles.buttonText}>Remove Child</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ParentSettings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fefaf8',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#ffffff', // White background
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
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
