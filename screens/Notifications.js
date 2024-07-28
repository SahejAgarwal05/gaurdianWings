import messaging from '@react-native-firebase/messaging';
import { useEffect } from 'react';
import { ref, set } from 'firebase/database';
import { db } from './firebaseConfig';
import { Alert } from 'react-native';

export default function Notifications(username) {
  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
      return true;
    }
    return false;
  };

  const saveTokenToDatabase = async (token) => {
    const tokenRef = ref(db, `tokens/${username}`);
    await set(tokenRef, { token });
  };

  useEffect(() => {
    const initializeFCM = async () => {
      const hasPermission = await requestUserPermission();
      if (hasPermission) {
        const token = await messaging().getToken();
        if (token) {
          console.log('FCM Token:', token);
          await saveTokenToDatabase(token);
        } else {
          console.log('Failed to get FCM token');
        }
      } else {
        Alert.alert('Permission denied', 'Failed to get token status');
      }
    };

    initializeFCM();

    // Handle incoming messages
    const unsubscribeOnMessage = messaging().onMessage(async (remoteMessage) => {
      Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });

    return () => {
      unsubscribeOnMessage();
    };
  }, [username]);
}
