import firebase from 'firebase';
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBozIlHHzhSob05Ivp3x__dQU8aOMqSSU8",
  authDomain: "screen-demo-d0c48.firebaseapp.com",
  projectId: "screen-demo-d0c48",
  storageBucket: "screen-demo-d0c48.appspot.com",
  messagingSenderId: "280583837352",
  appId: "1:280583837352:web:ab833cc346739b03fdd49d",
  measurementId: "G-BW1W9EBKJM"
};


export const app = firebase.initializeApp(firebaseConfig);
export const fs = app.firestore();
export const auth = app.auth();
export const storage = app.storage('gs://screen-demo-d0c48.appspot.com');
