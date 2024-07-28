import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import ParentSettings from './ParentSettings';
import ParentHome from './ParentHome';
import ParentCalender from './ParentCalender';
import DrawerSignOutButton from './DrawerSignOutButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
const Drawer = createDrawerNavigator();

const ParentDashboard = ({ route, navigation }) => {
  const { username: parentUsername } = route.params;

  return (
    <Drawer.Navigator 
      initialRouteName="Home"
      drawerContent={(props) => <DrawerSignOutButton {...props} signOutScreen="Welcome" />}
    >
      <Drawer.Screen name="Home">
        {(props) => <ParentHome {...props} parentUsername={parentUsername} parentNavigation={navigation} />}
      </Drawer.Screen>
      <Drawer.Screen name="Settings">
        {(props) => <ParentSettings {...props} parentUsername={parentUsername} parentNavigation={navigation} />}
      </Drawer.Screen>
      <Drawer.Screen name="Calender">
        {(props) => <ParentCalender {...props} parentUsername={parentUsername} parentNavigation={navigation} />}
      </Drawer.Screen>
    </Drawer.Navigator>
  );
}

export default ParentDashboard;
