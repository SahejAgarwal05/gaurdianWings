const admin = require('firebase-admin');
const serviceAccount = require('./path/to/serviceAccountKey.json'); // Path to your service account key

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://<YOUR_FIREBASE_PROJECT_ID>.firebaseio.com"
});

const sendNotification = (token, payload) => {
  admin.messaging().sendToDevice(token, payload)
    .then(response => {
      console.log('Successfully sent message:', response);
    })
    .catch(error => {
      console.log('Error sending message:', error);
    });
};

// Example function to send a notification when a task is added
const notifyTaskAdded = async (childUsername) => {
  const tokenRef = ref(db, `tokens/${childUsername}`);
  const tokenSnapshot = await get(tokenRef);
  if (tokenSnapshot.exists()) {
    const token = tokenSnapshot.val().token;
    const payload = {
      notification: {
        title: 'New Task Added',
        body: 'A new task has been assigned to you.',
      },
    };
    sendNotification(token, payload);
  }
};

module.exports = { sendNotification, notifyTaskAdded };
