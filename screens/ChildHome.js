// import React, { useState, useEffect } from 'react';
// import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
// import { ref, onValue, get } from 'firebase/database';
// import { db } from './firebaseConfig';
// import { PieChart } from 'react-native-chart-kit';
// import { useNavigation } from '@react-navigation/native';

// const ChildHome = ({ username }) => {
//   const [tasksCount, setTasksCount] = useState({ completed: 0, pending: 0 });
//   const [availableTime, setAvailableTime] = useState(0);
//   const navigation = useNavigation();

//   useEffect(() => {
//     const fetchTasksCount = () => {
//       const tasksRef = ref(db, `child/${username}/Tasks`);
//       onValue(tasksRef, (snapshot) => {
//         if (snapshot.exists()) {
//           const data = snapshot.val();
//           const completedTasks = Object.values(data).filter(task => task.status === 'Completed');
//           const completed = completedTasks.length;
//           const pending = Object.values(data).filter(task => task.status === 'Pending').length;

//           const totalReward = completedTasks.reduce((total, task) => total + (parseFloat(task.reward) || 0), 0);
//           setTasksCount({ completed, pending });

//           const timeRef = ref(db, `child/${username}/`);
//           get(timeRef).then((snapshot) => {
//             if (snapshot.exists()) {
//               const currentAvailableTime = parseFloat(snapshot.val().availableTime) || 0;
//               const newAvailableTime = totalReward;
//               setAvailableTime(newAvailableTime);
//             } else {
//               setAvailableTime(totalReward);
//             }
//           });
//         }
//       }, (error) => {
//         console.error('Error fetching tasks:', error.message);
//       });
//     };

//     fetchTasksCount();
//   }, [username]);

//   const chartData = [
//     {
//       name: 'Completed',
//       count: tasksCount.completed,
//       color: '#00FF00',
//       legendFontColor: '#7F7F7F',
//       legendFontSize: 15,
//     },
//     {
//       name: 'Pending',
//       count: tasksCount.pending,
//       color: '#FF0000',
//       legendFontColor: '#7F7F7F',
//       legendFontSize: 15,
//     },
//   ];

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Task Progress</Text>
//       <PieChart
//         data={chartData}
//         width={Dimensions.get('window').width - 40}
//         height={220}
//         chartConfig={{
//           backgroundColor: '#1cc910',
//           backgroundGradientFrom: '#eff3ff',
//           backgroundGradientTo: '#efefef',
//           decimalPlaces: 2,
//           color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
//           style: {
//             borderRadius: 16,
//           },
//         }}
//         accessor="count"
//         backgroundColor="transparent"
//         paddingLeft="15"
//         absolute
//       />
//       <View style={styles.screenTimeContainer}>
//         <Text style={styles.screenTimeTitle}>Total Time Earned Till Date</Text>
//         <Text style={styles.screenTimeValue}>{availableTime} hours</Text>
//       </View>
//       <TouchableOpacity
//         style={styles.button}
//         onPress={() => navigation.navigate('Browser', { 'username': username })}
//       >
//         <Text style={styles.buttonText}>Go to Browser</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#fefaf8',
//   },
//   title: {
//     fontSize: 24,
//     marginBottom: 20,
//     textAlign: 'center',
//   },
//   screenTimeContainer: {
//     marginTop: 20,
//     alignItems: 'center',
//   },
//   screenTimeTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//   },
//   screenTimeValue: {
//     fontSize: 18,
//     color: '#333',
//   },
//   button: {
//     backgroundColor: '#ffffff', // White background to match the design
//     paddingVertical: 10,
//     paddingHorizontal: 25,
//     borderRadius: 25,
//     borderWidth: 1,
//     borderColor: '#000',
//     alignItems: 'center',
//     justifyContent: 'center',
//     alignSelf: 'center', // Center button horizontally
//     marginTop: 30, // Ensure there's spacing above the button
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.8,
//     shadowRadius: 2,
//     elevation: 1, // Shadow for Android
//   },
//   buttonText: {
//     color: '#000',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
// });

// export default ChildHome;


import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { ref, onValue, update, get } from 'firebase/database';
import { db } from './firebaseConfig';
import { PieChart } from 'react-native-chart-kit';
import { useNavigation } from '@react-navigation/native';

const ChildHome = ({ username }) => {
  const [tasksCount, setTasksCount] = useState({ completed: 0, pending: 0 });
  const [availableTime, setAvailableTime] = useState(0);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchTasksCount = () => {
      const tasksRef = ref(db, `child/${username}/Tasks`);
      onValue(tasksRef, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          const completedTasks = Object.values(data).filter(task => task.status === 'Completed');
          const completed = completedTasks.length;
          const pending = Object.values(data).filter(task => task.status === 'Pending').length;

          const totalReward = completedTasks.reduce((total, task) => total + (parseFloat(task.reward) || 0), 0);
          setTasksCount({ completed, pending });

          const timeRef = ref(db, `child/${username}/availableTime`);
          get(timeRef).then((snapshot) => {
            if (snapshot.exists()) {
              const currentAvailableTime = parseFloat(snapshot.val()) || 0;
              const newAvailableTime = currentAvailableTime + totalReward;
              setAvailableTime(newAvailableTime);
              update(timeRef, newAvailableTime);
            } else {
              setAvailableTime(totalReward);
              update(timeRef, totalReward);
            }
          });
        }
      }, (error) => {
        console.error('Error fetching tasks:', error.message);
      });
    };

    fetchTasksCount();
  }, [username]);

  const chartData = [
    {
      name: 'Completed',
      count: tasksCount.completed,
      color: '#00FF00',
      legendFontColor: '#7F7F7F',
      legendFontSize: 15,
    },
    {
      name: 'Pending',
      count: tasksCount.pending,
      color: '#FF0000',
      legendFontColor: '#7F7F7F',
      legendFontSize: 15,
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Task Progress</Text>
      <PieChart
        data={chartData}
        width={Dimensions.get('window').width - 40}
        height={220}
        chartConfig={{
          backgroundColor: '#1cc910',
          backgroundGradientFrom: '#eff3ff',
          backgroundGradientTo: '#efefef',
          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: {
            borderRadius: 16,
          },
        }}
        accessor="count"
        backgroundColor="transparent"
        paddingLeft="15"
        absolute
      />
      <View style={styles.screenTimeContainer}>
        <Text style={styles.screenTimeTitle}>Total Time Earned Till Date</Text>
        <Text style={styles.screenTimeValue}>{availableTime} hours</Text>
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Browser', { 'username': username })}
      >
        <Text style={styles.buttonText}>Go to Browser</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fefaf8',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  screenTimeContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  screenTimeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  screenTimeValue: {
    fontSize: 18,
    color: '#333',
  },
  button: {
    backgroundColor: '#ffffff', // White background to match the design
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center', // Center button horizontally
    marginTop: 30, // Ensure there's spacing above the button
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 1, // Shadow for Android
  },
  buttonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ChildHome;
