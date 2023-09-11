import { initializeApp } from "firebase/app";

import * as dotenv from "dotenv";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";
dotenv.config();

const firebaseConfig = {
  apiKey: "AIzaSyBjBbzhepKS9Z1eNUcQTALpUtzJgKbFPZw",
  authDomain: "test-90c8f.firebaseapp.com",
  databaseURL: "https://test-90c8f.firebaseio.com",
  projectId: "test-90c8f",
  storageBucket: "test-90c8f.appspot.com",
  messagingSenderId: "864825689268",
  appId: "1:864825689268:web:ae1acda1cbea0eb31983e1",
  measurementId: "G-NRL93CL4WW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
export const firestore = getFirestore(app);