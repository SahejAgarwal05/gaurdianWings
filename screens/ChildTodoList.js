import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, FlatList, Image, Alert } from 'react-native';
import { ref, get, update } from 'firebase/database';
import { db, storage, auth } from './firebaseConfig';
import * as ImagePicker from 'expo-image-picker';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { onAuthStateChanged } from 'firebase/auth';

const ChildTodoList = ({ username }) => {
  const [tasks, setTasks] = useState([]);
  const [hasPermission, setHasPermission] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      const tasksRef = ref(db, `child/${username}/Tasks`);
      const snapshot = await get(tasksRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        const tasksArray = Object.keys(data).map(key => ({
          id: key,
          ...data[key],
        }));
        setTasks(tasksArray);
      }
    };

    fetchTasks();
  }, [username]);

  useEffect(() => {
    const requestPermission = async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Permission to access media library is required!');
      }
      setHasPermission(status === 'granted');
    };

    requestPermission();
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  const handleUploadImage = async (taskId) => {
    if (!user) {
      Alert.alert('Error', 'You need to be authenticated to upload images.');
      return;
    }

    if (hasPermission === null) {
      Alert.alert('Error', 'Permission to access media library is not granted.');
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        const imageUri = result.assets[0].uri;

        const response = await fetch(imageUri);
        if (!response.ok) {
          throw new Error('Failed to fetch the image');
        }

        const blob = await response.blob();

        const imageRef = storageRef(storage, `tasks/${taskId}.jpg`);
        await uploadBytes(imageRef, blob);
        const imageUrl = await getDownloadURL(imageRef);

        const taskRef = ref(db, `child/${username}/Tasks/${taskId}`);
        await update(taskRef, { imageUrl });
        setTasks(tasks.map(task => (task.id === taskId ? { ...task, imageUrl } : task)));
        Alert.alert('Success', 'Image uploaded successfully!');
      }
    } catch (error) {
      console.error('Error uploading image:', error.message);
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>To-Do List</Text>
      <FlatList
        data={tasks}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.task}>
            <Text>{item.task}</Text>
            <Text>Deadline: {item.deadline}</Text>
            <Text>Reward: {item.reward} hours</Text>
            <Text>Status: {item.status}</Text>
            {item.imageUrl ? (
              <Image source={{ uri: item.imageUrl }} style={styles.image} />
            ) : (
              <Button title="Upload Image" onPress={() => handleUploadImage(item.id)} />
            )}
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  task: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  image: {
    width: 100,
    height: 100,
    marginTop: 10,
  },
});

export default ChildTodoList;
