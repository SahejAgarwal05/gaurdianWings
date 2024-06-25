import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, FlatList } from 'react-native';
import { ref, get, update } from 'firebase/database';
import { db } from './firebaseConfig';

const ChildTodoList = ({ username }) => {
  const [tasks, setTasks] = useState([]);

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

  const handleCompleteTask = async (taskId) => {
    const taskRef = ref(db, `child/${username}/Tasks/${taskId}`);
    await update(taskRef, { status: 'Completed' });
    setTasks(tasks.map(task => (task.id === taskId ? { ...task, status: 'Completed' } : task)));
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
            {item.status !== 'Completed' && (
              <Button title="Mark as Completed" onPress={() => handleCompleteTask(item.id)} />
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
});

export default ChildTodoList;
