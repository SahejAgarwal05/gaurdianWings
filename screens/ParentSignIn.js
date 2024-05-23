import React, { useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function ParentSignIn() {
  useEffect(() => {
    const ws = new WebSocket('ws://your-server-url');

    ws.onopen = () => {
      console.log('connected');
      ws.send('Parent connected');
    };

    ws.onmessage = (e) => {
      console.log('Message:', e.data);
    };

    return () => {
      ws.close();
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text>Parent Sign-In Page</Text>
      <Button title="Sign In" onPress={() => {}} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
