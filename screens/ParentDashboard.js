import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import ParentSettings from './ParentSettings';
import ParentHome from './ParentHome'; // New component to display children

const Drawer = createDrawerNavigator();

const ParentDashboard = ({ route, navigation }) => {
  const parentUsername  = route.params.username;

  return (
    <NavigationContainer independent={true}>
      <Drawer.Navigator initialRouteName="Home">
        <Drawer.Screen name="Home">
          {(props) => <ParentHome {...props} parentUsername={parentUsername} parentNavigation={navigation} />}
        </Drawer.Screen>
        <Drawer.Screen name="Settings">
          {(props) => <ParentSettings {...props} parentUsername={parentUsername} parentNavigation={navigation} />}
        </Drawer.Screen>
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

export default ParentDashboard;
