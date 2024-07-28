import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, Alert, Modal, TouchableOpacity, Pressable } from 'react-native';
import { ref, get, update } from 'firebase/database';
import { db, storage } from './firebaseConfig';
import * as ImagePicker from 'expo-image-picker';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';

const ChildTodoList = ({ username }) => {
  const [tasks, setTasks] = useState([]);
  const [hasPermission, setHasPermission] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [availableTime, setAvailableTime] = useState(0);

  useEffect(() => {
    const fetchTasksAndTime = async () => {
      const tasksRef = ref(db, `child/${username}/Tasks`);
      const timeRef = ref(db, `child/${username}/availableTime`);
      const tasksSnapshot = await get(tasksRef);
      const timeSnapshot = await get(timeRef);

      if (tasksSnapshot.exists()) {
        const data = tasksSnapshot.val();
        const tasksArray = Object.keys(data).map(key => ({
          id: key,
          ...data[key],
        }));
        setTasks(tasksArray);
      }

      if (timeSnapshot.exists()) {
        const timeData = timeSnapshot.val();
        console.log('Fetched availableTime:', timeData); // Log the fetched data
        const parsedTime = typeof timeData === 'string' ? parseInt(timeData, 10) : timeData;
        if (!isNaN(parsedTime)) {
          setAvailableTime(parsedTime);
        } else {
          console.error('Expected availableTime to be a number');
        }
      }
    };

    fetchTasksAndTime();
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

  const handleUploadImage = async (taskId) => {
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

        const imageRef = storageRef(storage, `tasks/${taskId}/${Date.now()}.jpg`);
        await uploadBytes(imageRef, blob);
        const imageUrl = await getDownloadURL(imageRef);

        const taskRef = ref(db, `child/${username}/Tasks/${taskId}`);
        const snapshot = await get(taskRef);
        const task = snapshot.val();
        const imageUrls = task.imageUrls ? [...task.imageUrls, imageUrl] : [imageUrl];

        await update(taskRef, { imageUrls, status: 'Pending' }); // Set status back to 'Pending'
        setTasks(tasks.map(task => (task.id === taskId ? { ...task, imageUrls, status: 'Pending' } : task)));
        Alert.alert('Success', 'Image uploaded successfully!');
      }
    } catch (error) {
      console.error('Error uploading image:', error.message);
      Alert.alert('Error', error.message);
    }
  };

  const handleImagePress = (imageUrl) => {
    setSelectedImage(imageUrl);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>To-Do List</Text>
      <Text style={styles.availableTime}>Available Time: {availableTime} hours</Text>
      <FlatList
        data={tasks}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.task}>
            <Text>{item.task}</Text>
            <Text>Deadline: {item.deadline}</Text>
            <Text>Reward: {item.reward} hours</Text>
            <Text>Status: {item.status}</Text>
            <FlatList
              data={item.imageUrls || []}
              keyExtractor={(url, index) => index.toString()}
              renderItem={({ item: url }) => (
                <TouchableOpacity onPress={() => handleImagePress(url)}>
                  <Image source={{ uri: url }} style={styles.image} />
                </TouchableOpacity>
              )}
              horizontal
            />
            <TouchableOpacity style={styles.button} onPress={() => handleUploadImage(item.id)}>
              <Text style={styles.buttonText}>Upload Image</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      {selectedImage && (
        <Modal
          visible={modalVisible}
          transparent={true}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <Image source={{ uri: selectedImage }} style={styles.fullImage} />
            <Pressable style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </Pressable>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: '#fefaf8',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  availableTime: {
    fontSize: 20,
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
    marginRight: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  fullImage: {
    width: '80%',
    height: '80%',
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 5,
  },
  closeButtonText: {
    fontSize: 18,
  },
  button: {
    backgroundColor: '#ffffff',
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#000',
    fontSize: 16,
  },
});

export default ChildTodoList;
