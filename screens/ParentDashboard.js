import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import ParentSettings from './ParentSettings';
import ParentTodoList from './ParentTodoList';

const Drawer = createDrawerNavigator();

const ParentDashboard = ({ route }) => {
  const { username } = route.params;

  return (
    <NavigationContainer independent={true}>
      <Drawer.Navigator initialRouteName="ParentHome">
        <Drawer.Screen name="Settings">
          {(props) => <ParentSettings {...props} username={username} />}
        </Drawer.Screen>
        <Drawer.Screen name="To-do List">
          {(props) => <ParentTodoList {...props} username={username} />}
        </Drawer.Screen>
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

export default ParentDashboard;

