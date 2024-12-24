import { initializeApp } from "firebase/app";
import { getMessaging } from 'firebase/messaging/sw';
import { getToken, onMessage } from 'firebase/messaging';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDe9udBO7hEmmRqwGQbQCsjhpLkG9rYUyc",
  authDomain: "hogwarts-c7c45.firebaseapp.com",
  projectId: "hogwarts-c7c45",
  storageBucket: "hogwarts-c7c45.firebasestorage.app",
  messagingSenderId: "230088672401",
  appId: "1:230088672401:web:2307df0163d06d6cc5eb30"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const messaging = getMessaging(app);

export { messaging, getToken, onMessage };