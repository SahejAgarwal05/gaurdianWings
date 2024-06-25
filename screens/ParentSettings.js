import React, { useState, useEffect } from 'react';
import { Button, View, StyleSheet, Text } from 'react-native';
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
    parentNavigation.navigate('AddChildScreen', { username : parentUsername });
  };

  const handleRemoveChild = () => {
    parentNavigation.navigate('RemoveChildScreen', { username : parentUsername });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      {children.map((child, index) => (
        <Text key={index}>{child.name}</Text>
      ))}
      <Button
        title="Add Child"
        onPress={handleAddChild}
        style={styles.addButton}
      />
      <Button
        title="Remove Child"
        onPress={handleRemoveChild}
        style={styles.removeButton}
      />
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
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  addButton: {
    marginTop: 20,
  },
  removeButton: {
    marginTop: 20,
  },
});
