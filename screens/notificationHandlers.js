import messaging from '@react-native-firebase/messaging';

export function configureNotificationHandlers() {
  messaging().onNotificationOpenedApp(remoteMessage => {
    console.log('Notification caused app to open from background state:', remoteMessage.notification);
  });

  messaging().getInitialNotification().then(remoteMessage => {
    if (remoteMessage) {
      console.log('Notification caused app to open from quit state:', remoteMessage.notification);
    }
  });
}
