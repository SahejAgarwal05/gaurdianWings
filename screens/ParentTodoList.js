import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { ref, push } from 'firebase/database';
import { db } from './firebaseConfig';

const ParentTodoList = ({ route }) => {
  const { parentUsername, childUsername } = route.params;
  const [task, setTask] = useState('');
  const [reward, setReward] = useState('');
  const [deadline, setDeadline] = useState('');

  const handleAddTask = async () => {
    if (task && reward && deadline) {
      const tasksRef = ref(db, `child/${childUsername}/Tasks`);
      await push(tasksRef, {
        task,
        reward,
        deadline,
        status: 'Pending',
      });
      setTask('');
      setReward('');
      setDeadline('');
      Alert.alert('Success', 'Task added successfully!');
    } else {
      Alert.alert('Error', 'All fields are required.');
    }
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
      <TextInput
        style={styles.input}
        placeholder="Deadline (YYYY-MM-DD)"
        value={deadline}
        onChangeText={setDeadline}
      />
      <Button title="Add Task" onPress={handleAddTask} />
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
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
  },
});

export default ParentTodoList;

