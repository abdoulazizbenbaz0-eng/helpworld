import { initializeApp, getApps, getApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence, getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

// IMPORTANT : remplace ces valeurs par celles de ton projet Firebase "helpworld-8568e"
// Console Firebase > Parametres du projet > Tes applications > Config
const firebaseConfig = {
  apiKey: "REMPLACE_MOI",
  authDomain: "helpworld-8568e.firebaseapp.com",
  projectId: "helpworld-8568e",
  storageBucket: "helpworld-8568e.appspot.com",
  messagingSenderId: "REMPLACE_MOI",
  appId: "REMPLACE_MOI",
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
