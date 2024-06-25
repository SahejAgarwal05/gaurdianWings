import React, { useState, useEffect } from 'react';
import { Button, View, StyleSheet, Text } from 'react-native';
import { ref, get, onValue } from 'firebase/database';
import { db } from './firebaseConfig';
import { useIsFocused } from '@react-navigation/native';

const ParentHome = ({ route, navigation, parentNavigation, parentUsername }) => {
  console.log(parentNavigation);
  const [children, setChildren] = useState([]);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (!parentUsername) {
      console.error('Parent username is not defined');
      return;
    }

    const fetchChildren = () => {
      const userRef = ref(db, `parent/${parentUsername}/Children`);
      onValue(userRef, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          setChildren(Object.keys(data));
          console.log('Fetched children:', Object.keys(data));
        } else {
          console.log('No children found for this parent.');
        }
      }, (error) => {
        console.error('Error fetching children:', error.message);
      });
    };

    if (isFocused) {
      fetchChildren();
    }
  }, [isFocused, parentUsername]);

  return (
    <View style={styles.container}>
      <Text style={styles.username}>Welcome {parentUsername}</Text>
      {children.length > 0 ? (
        children.map((childUsername, index) => (
          <Button
            key={index}
            title={childUsername}
            onPress={() => parentNavigation.navigate('ParentTodoList', { parentUsername, childUsername })}
          />
        ))
      ) : (
        <Text>No children found.</Text>
      )}
    </View>
  );
};

export default ParentHome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  username: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
});
