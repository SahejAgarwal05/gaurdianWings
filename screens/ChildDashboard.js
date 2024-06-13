import React, { useState, useEffect } from 'react';
import { Button, View, StyleSheet, Text } from 'react-native';
import { ref, get } from 'firebase/database';
import { app, db } from './firebaseConfig';

const ChildDashboard = ({ navigation, route }) => {
  const { username } = route.params;
  const [parent, setParent] = useState(null);

  useEffect(() => {
    const fetchParent = async () => {
      try {
        const userRef = ref(db, `child/${username}`);
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
          const data = snapshot.val();
          setParent(data.parent);
        }
      } catch (error) {
        console.error('Error fetching parent:', error.message);
      }
    };

    fetchParent();
  }, [username]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Child Dashboard</Text>
      {parent && (
        <Text style={styles.parentText}>Parent: {parent}</Text>
      )}
    </View>
  );
};

export default ChildDashboard;

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
  parentText: {
    fontSize: 20,
    textAlign: 'center',
    marginTop: 10,
  },
});
