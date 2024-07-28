import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import ChildSettings from './ChildSettings';
import ChildTodoList from './ChildTodoList';
import ChildHome from './ChildHome';
import Browser from './ChildBrowser'
import DrawerSignOutButton from './DrawerSignOutButton';

const Drawer = createDrawerNavigator();

const ChildDashboard = ({ route }) => {
  const { username } = route.params;

  return (
    <Drawer.Navigator 
      initialRouteName="Home"
      drawerContent={(props) => <DrawerSignOutButton {...props} signOutScreen="Welcome" />}
    >
        <Drawer.Screen name="Home">
          {(props) => <ChildHome {...props} username={username} />} 
        </Drawer.Screen>
        <Drawer.Screen name="To-Do List">
          {(props) => <ChildTodoList {...props} username={username} />} 
        </Drawer.Screen>
        <Drawer.Screen name="Settings">
          {(props) => <ChildSettings {...props} username={username} />}
        </Drawer.Screen>
        <Drawer.Screen name="Browser">
          {(props) => <Browser {...props} username={username} />}
        </Drawer.Screen>
      </Drawer.Navigator>
  );
}

export default ChildDashboard;
