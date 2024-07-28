import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, FlatList, TouchableOpacity, Image, Modal, Pressable } from 'react-native';
import { ref, push, onValue, update, remove } from 'firebase/database';
import { db } from './firebaseConfig';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as WebBrowser from 'expo-web-browser'; // Import WebBrowser

const ParentTodoList = ({ route }) => {
  const { parentUsername, childUsername } = route.params;
  const [task, setTask] = useState('');
  const [reward, setReward] = useState('');
  const [deadline, setDeadline] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false); // State to toggle between tasks and history
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchTasks = () => {
      const tasksRef = ref(db, `child/${childUsername}/Tasks`);
      onValue(tasksRef, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          const tasksArray = Object.keys(data).map(key => ({
            id: key,
            ...data[key],
          }));
          setTasks(tasksArray);
        }
      }, (error) => {
        console.error('Error fetching tasks:', error.message);
      });
    };

    const fetchHistory = () => {
      const historyRef = ref(db, `child/${childUsername}/browsingHistory`);
      onValue(historyRef, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          const historyArray = Object.keys(data).map(key => ({
            id: key,
            ...data[key],
          }));
          setHistory(historyArray);
        }
      }, (error) => {
        console.error('Error fetching history:', error.message);
      });
    };

    fetchTasks();
    fetchHistory();
  }, [childUsername]);

  const handleAddTask = async () => {
    if (task && reward && deadline) {
      const tasksRef = ref(db, `child/${childUsername}/Tasks`);
      await push(tasksRef, {
        task,
        reward,
        deadline: deadline.toISOString().split('T')[0], // Format the deadline as YYYY-MM-DD
        status: 'Pending',
      });
      setTask('');
      setReward('');
      setDeadline(new Date());
      Alert.alert('Success', 'Task added successfully!');
    } else {
      Alert.alert('Error', 'All fields are required.');
    }
  };

  const onChange = (event, selectedDate) => {
    setShowPicker(false); // Close the picker after selecting a date
    if (selectedDate) {
      // Adjust the selected date to match the local timezone
      const localDate = new Date(selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000);
      setDeadline(localDate); // Update the deadline state with the adjusted date
    }
  };

  const showDatePicker = () => {
    setShowPicker(true);
  };

  const handleDeleteTask = async (taskId) => {
    const taskRef = ref(db, `child/${childUsername}/Tasks/${taskId}`);
    await remove(taskRef);
    setTasks(tasks.filter(task => task.id !== taskId));
    Alert.alert('Success', 'Task deleted successfully!');
  };

  const handleVerifyTask = async (taskId) => {
    const taskRef = ref(db, `child/${childUsername}/Tasks/${taskId}`);
    await update(taskRef, { status: 'Completed' });
    const timeReward = tasks.find(task => task.id === taskId).reward;
    const timeRef = ref(db, `child/${childUsername}/availableTime`);
    await update(timeRef, (time) => time + timeReward);
    setTasks(tasks.map(task => (task.id === taskId ? { ...task, status: 'Completed' } : task)));
    Alert.alert('Success', 'Task marked as completed!');
  };

  const handleRejectTask = async (taskId) => {
    const taskRef = ref(db, `child/${childUsername}/Tasks/${taskId}`);
    await update(taskRef, { status: 'Rejected' });
    setTasks(tasks.map(task => (task.id === taskId ? { ...task, status: 'Rejected' } : task)));
    Alert.alert('Success', 'Task marked as rejected!');
  };

  const handleImagePress = (imageUrl) => {
    setSelectedImage(imageUrl);
    setModalVisible(true);
  };

  const openWebPage = async (url) => {
    await WebBrowser.openBrowserAsync(url);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Assign New Task to {childUsername}</Text>
      <TextInput
        style={styles.input}
        placeholder="Task Description"
        value={task}
        onChangeText={setTask}
      />
      <TextInput
        style={styles.input}
        placeholder="Reward (hours of screen time)"
        value={reward}
        onChangeText={setReward}
      />
      <TouchableOpacity onPress={showDatePicker} style={styles.dateButton}>
        <Text style={styles.dateButtonText}>Choose Deadline: {deadline.toISOString().split('T')[0]}</Text>
      </TouchableOpacity>
      {showPicker && (
        <DateTimePicker
          value={deadline}
          mode="date"
          display="default"
          onChange={onChange}
        />
      )}
      <TouchableOpacity style={styles.button} onPress={handleAddTask}>
        <Text style={styles.buttonText}>Add Task</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => setShowHistory(!showHistory)}>
        <Text style={styles.buttonText}>{showHistory ? "Show Tasks" : "Show History"}</Text>
      </TouchableOpacity>

      {/* Conditionally Render Tasks or History */}
      {showHistory ? (
        <>
          <Text style={styles.subtitle}>History</Text>
          <FlatList
            data={history}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => openWebPage(item.url)}>
                <View style={styles.historyItem}>
                  <Text>{item.url}</Text>
                  <Text>{item.timestamp}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </>
      ) : (
        <>
          <Text style={styles.subtitle}>Tasks</Text>
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
                {(item.status === 'Pending' || item.status === 'Rejected') && (
                  <View style={styles.buttonRow}>
                    <TouchableOpacity style={styles.actionButton} onPress={() => handleVerifyTask(item.id)}>
                      <Text style={styles.actionButtonText}>Accept</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionButton} onPress={() => handleRejectTask(item.id)}>
                      <Text style={styles.actionButtonText}>Reject</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionButton} onPress={() => handleDeleteTask(item.id)}>
                      <Text style={styles.actionButtonText}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            )}
            contentContainerStyle={styles.scrollContent}
          />
        </>
      )}

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
    paddingTop: 60,
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  dateButton: {
    padding: 10,
    backgroundColor: '#4CAF50',
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 10,
  },
  dateButtonText: {
    color: 'white',
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  task: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: '#ffffff',
  },
  historyItem: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: '#ffffff',
  },
  image: {
    width: 100,
    height: 100,
    marginTop: 10,
    marginRight: 10,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  actionButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 14,
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
});

export default ParentTodoList;
