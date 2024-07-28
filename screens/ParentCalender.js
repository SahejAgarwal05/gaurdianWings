import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { ref, onValue } from 'firebase/database';
import { db } from './firebaseConfig';

const CalendarView = ({ parentUsername }) => {
  const [tasks, setTasks] = useState({});
  const [childrenColors, setChildrenColors] = useState({});
  const colors = ['#ff0000', '#00ff00', '#0000ff', '#ff00ff', '#00ffff']; // Add more colors if needed

  useEffect(() => {
    const fetchChildrenTasks = () => {
      const userRef = ref(db, `parent/${parentUsername}/Children`);
      onValue(userRef, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          const children = Object.keys(data);
          const tasks = {};
          const childrenColors = {};
          children.forEach((child, index) => {
            fetchTasks(child, colors[index % colors.length], tasks, childrenColors);
          });
        } else {
          setTasks({});
          setChildrenColors({});
        }
      }, (error) => {
        console.error('Error fetching children:', error.message);
      });
    };

    fetchChildrenTasks();
  }, [parentUsername]);

  const fetchTasks = (childUsername, color, tasks, childrenColors) => {
    const tasksRef = ref(db, `child/${childUsername}/Tasks`);
    onValue(tasksRef, (snapshot) => {
      const newTasks = { ...tasks };

      // Clear out old tasks for the child
      Object.keys(newTasks).forEach(date => {
        newTasks[date] = newTasks[date].filter(task => task.childUsername !== childUsername);
        if (newTasks[date].length === 0) delete newTasks[date];
      });

      if (snapshot.exists()) {
        const data = snapshot.val();
        Object.keys(data).forEach((taskId) => {
          const task = data[taskId];
          if (newTasks[task.deadline]) {
            newTasks[task.deadline].push({ name: task.task, color: color, childUsername });
          } else {
            newTasks[task.deadline] = [{ name: task.task, color: color, childUsername }];
          }
        });
      }

      setTasks(newTasks);
      setChildrenColors((prev) => ({ ...prev, [childUsername]: color }));
    });
  };

  return (
    <View style={styles.container}>
      <Calendar
        markingType={'multi-dot'}
        markedDates={Object.keys(tasks).reduce((acc, date) => {
          acc[date] = {
            dots: tasks[date].map((task) => ({ color: task.color })),
          };
          return acc;
        }, {})}
      />
      <View style={styles.legend}>
        <Text style={styles.legendTitle}>Legend</Text>
        {Object.keys(childrenColors).map((child, index) => (
          <View key={index} style={styles.legendItem}>
            <View
              style={[styles.colorBox, { backgroundColor: childrenColors[child] }]}
            />
            <Text>{child}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default CalendarView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fefaf8'
  },
  legend: {
    marginTop: 20,
  },
  legendTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  colorBox: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
});
