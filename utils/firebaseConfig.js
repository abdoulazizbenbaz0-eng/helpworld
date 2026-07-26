import { initializeApp, getApps, getApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence, getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyDz27N8QJ4oNPPxJjBSezQZZ-02tT82PdA",
  authDomain: "helpworld-8568e.firebaseapp.com",
  projectId: "helpworld-8568e",
  storageBucket: "helpworld-8568e.firebasestorage.app",
  messagingSenderId: "123332903969",
  appId: "1:123332903969:web:66c5a89467d49748378f60",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

let auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch (e) {
  auth = getAuth(app);
}

const db = getFirestore(app);

export { app, auth, db };
