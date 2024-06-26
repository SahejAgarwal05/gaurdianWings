import { initializeApp } from "firebase/app";
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth'; 

const firebaseConfig = {
  apiKey: "AIzaSyBauQCzef_tfHTRIQSXXlbgukxrldkjJEM",
  authDomain: "gaurdianwings-6a603.firebaseapp.com",
  projectId: "gaurdianwings-6a603",
  storageBucket: "gaurdianwings-6a603.appspot.com",
  messagingSenderId: "1046832296621",
  appId: "1:1046832296621:web:f1d7dc4930aed5ddae8c24",
  measurementId: "G-GX2PEPMMFN",
  databaseURL: "https://gaurdianwings-6a603-default-rtdb.asia-southeast1.firebasedatabase.app/"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const storage = getStorage(app);
const auth = getAuth(app); 

export { app, db, storage, auth };

