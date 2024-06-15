import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ChildScreen = ({ route }) => {
  const { username } = route.params;
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Child Username: {username}</Text>
    </View>
  );
};

export default ChildScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
});
