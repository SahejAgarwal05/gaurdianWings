import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeSceen';
import ChildSignIn from './screens/ChildSignIn';
import ParentSignIn from './screens/ParentSignIn';
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="ChildSignIn" component={ChildSignIn} />
        <Stack.Screen name="ParentSignIn" component={ParentSignIn} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
