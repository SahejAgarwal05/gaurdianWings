import React from 'react';
import { SafeAreaView, StatusBar, StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import ChildSignIn from './screens/ChildSignIn';
import ParentSignIn from './screens/ParentSignIn';
import CreateUser from './screens/CreateUser';
import ParentDashboard from './screens/ParentDashboard';
import ChildDashboard from './screens/ChildDashboard';
import AddChildScreen from './screens/AddChildScreen'; // Import AddChildScreen

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerStyle: styles.header, contentStyle: styles.screenBackground }} />
        <Stack.Screen name="ChildSignIn" component={ChildSignIn} />
       <Stack.Screen name="AddChildScreen" component={AddChildScreen} /> 
        <Stack.Screen name="ParentSignIn" component={ParentSignIn} />
        <Stack.Screen name="CreateUser" component={CreateUser} />
        <Stack.Screen name="ParentDashboard" component={ParentDashboard} />
        <Stack.Screen name="ChildDashboard" component={ChildDashboard} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: 'white'
  },
  screenBackground: {
    backgroundColor: 'lightblue'
  }
})

export default App;