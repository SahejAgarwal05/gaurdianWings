import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, TextInput, Alert } from 'react-native';
import { DrawerItemList } from '@react-navigation/drawer';
import { getAuth, signOut } from 'firebase/auth';
import { app } from './firebaseConfig';
import { CommonActions } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getDatabase, ref, get } from 'firebase/database';

const auth = getAuth(app);
const database = getDatabase(app);

const DrawerSignOutButton = (props) => {
  const { signOutScreen } = props;
  const [modalVisible, setModalVisible] = useState(false);
  const [password, setPassword] = useState('');
  const [parentPassword, setParentPassword] = useState('');
  const [savedUser, setSavedUser] = useState(null);

  const handleLogout = async () => {
    try {
      console.log('Signing out...');
      const user = JSON.parse(await AsyncStorage.getItem('user'));
      setSavedUser(user);
      console.log('User:', user);
      if (user.type === 'child') {
        const parentUsernameRef = ref(database, `child/${user.username}/parent`);
        const parentUsernameSnapshot = await get(parentUsernameRef);
        if (parentUsernameSnapshot.exists()) {
          const parentUsername = parentUsernameSnapshot.val();
          if (parentUsername === 'n' || !parentUsername) {
            await AsyncStorage.clear();
            await signOut(auth);
            props.navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: signOutScreen }],
              })
            );
          } else {
            const parentPasswordRef = ref(database, `parent/${parentUsername}/password`);
            const parentPasswordSnapshot = await get(parentPasswordRef);
            if (parentPasswordSnapshot.exists()) {
              setParentPassword(parentPasswordSnapshot.val());
              setModalVisible(true);
            } else {
              console.error('Parent password not found.');
            }
          }
        } else {
          console.error('Parent username not found.');
        }
      } else {
        console.log('Parent user signed out.'); 
        await AsyncStorage.clear();
        await signOut(auth);
        props.navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: signOutScreen }],
          })
        );
      }
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handlePasswordSubmit = async () => {
    if (password.trim() === parentPassword) {
      await AsyncStorage.clear();
      await signOut(auth);
      props.navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: signOutScreen }],
        })
      );
    } else {
      Alert.alert('Incorrect Password', 'The password you entered is incorrect.');
    }
    setPassword('');
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.drawerList}>
        <DrawerItemList {...props} />
      </View>
      <View style={styles.logoutContainer}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Parent Password Required</Text>
            <Text style={styles.modalMessage}>Please enter the parent password to log out:</Text>
            <TextInput
              style={styles.textInput}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={true}
              placeholder="Enter parent password"
            />
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.okButton} onPress={handlePasswordSubmit}>
                <Text style={styles.buttonText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: 40,
  },
  drawerList: {
    flex: 1,
  },
  logoutContainer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  logoutButton: {
    backgroundColor: '#ff4d4d',
    alignItems: 'center',
    padding: 10,
    borderRadius: 5,
  },
  logoutButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  textInput: {
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  cancelButton: {
    backgroundColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  okButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default DrawerSignOutButton;
