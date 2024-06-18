import React, { useState, useEffect } from 'react';
import { Button, View, StyleSheet, Text } from 'react-native';
import { ref, get } from 'firebase/database';
import { db } from './firebaseConfig';

const ParentSettings = ({ navigation, username }) => {
  const [children, setChildren] = useState([]);

  useEffect(() => {
    if (!username) {
      console.error('Username is not defined');
      return;
    }

    const fetchChildren = async () => {
      try {
        const userRef = ref(db, `parent/${username}/Children`);
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
          const data = snapshot.val();
          setChildren(Object.keys(data)); // Getting usernames instead of values
          console.log('Fetched children:', Object.keys(data)); // Debugging log
        } else {
          console.log('No children found for this parent.'); // Debugging log
        }
      } catch (error) {
        console.error('Error fetching children:', error.message);
      }
    };

    fetchChildren();
  }, [username]);

  const handleAddChild = () => {
    navigation.navigate('AddChildScreen', { username });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Parent Dashboard</Text>
      {children.length > 0 ? (
        children.map((childUsername, index) => (
          <Button
            key={index}
            title={childUsername} // Preserve original case
            onPress={() => navigation.navigate('ChildScreen', { parentUsername: username, childUsername })}
          />
        ))
      ) : (
        <Text>No children found.</Text>
      )}
      <Button
        title="Add Child"
        onPress={handleAddChild}
        style={styles.addButton}
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
});