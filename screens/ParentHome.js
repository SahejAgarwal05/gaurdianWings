import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { ref, onValue, off } from 'firebase/database';
import { db } from './firebaseConfig';
import { useIsFocused } from '@react-navigation/native';

const ParentHome = ({ route, parentNavigation, parentUsername, navigation }) => {
  const [children, setChildren] = useState([]);
  const [tasksCount, setTasksCount] = useState({});
  const isFocused = useIsFocused();

  useEffect(() => {
    if (!parentUsername) {
      console.error('Parent username is not defined');
      return;
    }

    const userRef = ref(db, `parent/${parentUsername}/Children`);

    const handleValueChange = (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setChildren(Object.keys(data));
        Object.keys(data).forEach(child => fetchTasksCount(child));
      } else {
        setChildren([]);
      }
    };

    onValue(userRef, handleValueChange, (error) => {
      console.error('Error fetching children:', error.message);
    });

    return () => {
      off(userRef, 'value', handleValueChange);
    };
  }, [parentUsername]);

  const fetchTasksCount = (childUsername) => {
    const tasksRef = ref(db, `child/${childUsername}/Tasks`);
    onValue(tasksRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const completed = Object.values(data).filter(task => task.status === 'Completed').length;
        const pending = Object.values(data).filter(task => task.status === 'Pending').length;
        setTasksCount(prev => ({ ...prev, [childUsername]: { completed, pending } }));
      }
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.topHalf}>
        <Text style={styles.title}>Welcome, {parentUsername}</Text>
        <View style={styles.topContent}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Children</Text>
            <ScrollView style={styles.childrenList} contentContainerStyle={styles.childrenListContent}>
              {children.map((childUsername, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.childButton}
                  onPress={() => navigation.navigate('ParentTodoList', { parentUsername, childUsername })}
                >
                  <Text style={styles.childButtonText}>{childUsername}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Summary</Text>
            <ScrollView style={styles.tasksSummary} contentContainerStyle={styles.tasksSummaryContent}>
              {children.map((childUsername, index) => (
                <View key={index} style={styles.taskCountRow}>
                  <Text style={styles.childNameText}>{childUsername}</Text>
                  <View style={styles.taskSummary}>
                    <Text>Completed: {tasksCount[childUsername]?.completed || 0}</Text>
                    <Text>Outstanding: {tasksCount[childUsername]?.pending || 0}</Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </View>
    </View>
  );
};

export default ParentHome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fefaf8',
  },
  topHalf: {
    flex: 1,
    backgroundColor: '#fefaf8',
    padding: 20,
    paddingRight: 30,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  topContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
  },
  section: {
    flex: 1,
    paddingHorizontal: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  childrenList: {
    flex: 1,
  },
  childrenListContent: {
    alignItems: 'center',
  },
  tasksSummary: {
    flex: 1,
  },
  tasksSummaryContent: {
    alignItems: 'center',
  },
  childButton: {
    backgroundColor: '#ffffff',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#000',
    marginBottom: 10,
    alignItems: 'center',
  },
  childButtonText: {
    fontSize: 18,
    color: '#000',
  },
  taskCountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  childNameText: {
    fontSize: 18,
    color: '#000',
    marginRight: 10,
  },
  taskSummary: {
    alignItems: 'flex-start',
  },
});
