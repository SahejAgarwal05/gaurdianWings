import React from 'react';
import { SafeAreaView, StatusBar, StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeSceen';
import ChildSignIn from './screens/ChildSignIn';
import ParentSignIn from './screens/ParentSignIn';
const Stack = createNativeStackNavigator();

const App = () => {
  return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={HomeScreen} options={{   headerStyle: styles.header,
          contentStyle: styles.screenBackground}}/>
          <Stack.Screen name="ChildSignIn" component={ChildSignIn} />
          <Stack.Screen name="ParentSignIn" component={ParentSignIn} />
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

export default App
