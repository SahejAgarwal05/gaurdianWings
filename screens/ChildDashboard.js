import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import ChildSettings from './ChildSettings';
import ChildTodoList from './ChildTodoList';

const Drawer = createDrawerNavigator();

const ChildDashboard = ({ route }) => {
  const { username } = route.params;

  return (
    <NavigationContainer independent={true}>
      <Drawer.Navigator initialRouteName="ParentHome">
        <Drawer.Screen name="Settings">
          {(props) => <ChildSettings {...props} username={username} />}
        </Drawer.Screen>
        <Drawer.Screen name="Home">
          {(props) => <ChildTodoList {...props} username={username} />}
        </Drawer.Screen>
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

export default ChildDashboard;
