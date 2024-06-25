import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, FlatList, TouchableOpacity } from 'react-native'; // Import TouchableOpacity
import { ref, push, onValue, remove } from 'firebase/database';
import { db } from './firebaseConfig';
import DateTimePicker from '@react-native-community/datetimepicker';

const ParentTodoList = ({ route }) => {
  const { parentUsername, childUsername } = route.params;
  const [task, setTask] = useState('');
  const [reward, setReward] = useState('');
  const [deadline, setDeadline] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [tasks, setTasks] = useState([]);

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

    fetchTasks();
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
    const currentDate = selectedDate || deadline;
    setShowPicker(Platform.OS === 'ios');
    setDeadline(currentDate);
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
      <Button title="Add Task" onPress={handleAddTask} />

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
            {item.status === 'Completed' && (
              <Button title="Delete" onPress={() => handleDeleteTask(item.id)} />
            )}
          </View>
        )}
        contentContainerStyle={styles.scrollContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 20,
    marginTop: 20,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
  },
  dateButton: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
    backgroundColor: 'lightgray',
  },
  dateButtonText: {
    fontSize: 16,
  },
  task: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  scrollContent: {
    paddingBottom: 20,
  },
});

export default ParentTodoList;
