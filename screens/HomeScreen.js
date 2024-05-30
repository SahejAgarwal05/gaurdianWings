import React from 'react';
import { View, Button, StyleSheet } from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <Button
          title="Parent"
        onPress={() => navigation.navigate('ParentSignIn')}
        />
      </View>
    <View style={styles.spacer} /> 
      <View style={styles.buttonContainer}>
        <Button
          title="Child"
          onPress={() => navigation.navigate('ChildSignIn')}
        />
      </View>
    <View style={styles.spacer} /> 
      <View style={styles.buttonContainer}>
        <Button
          title="Create Account"
          onPress={() => navigation.navigate('CreateUser')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonContainer: {
    marginBottom: 20,
    width: '80%'
  }

});
