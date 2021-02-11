import * as firebase from "firebase";
import "firebase/auth";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCxLXET9dPg7WwdndZHVAvf3ONv5B8MAZg",
  authDomain: "hplurlshortener.firebaseapp.com",
  databaseURL: "https://hplurlshortener.firebaseio.com",
  projectId: "hplurlshortener",
  storageBucket: "hplurlshortener.appspot.com",
  messagingSenderId: "853153982796",
  appId: "1:853153982796:web:c96e2f98050b968845c7e9",
  measurementId: "G-FSBW1QHCTN",
};

let app;

if (firebase.apps.length === 0) {
  app = firebase.initializeApp(firebaseConfig);
} else {
  app = firebase.app();
}

const db = app.firestore();
const auth = firebase.auth();

export { db, auth };
