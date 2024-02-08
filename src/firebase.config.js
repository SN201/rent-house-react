// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCx5gIns4SxnGrgX5Cl_u2MG-G1NFlTxkw",
  authDomain: "rent-houses-c8d6f.firebaseapp.com",
  projectId: "rent-houses-c8d6f",
  storageBucket: "rent-houses-c8d6f.appspot.com",
  messagingSenderId: "1270657710",
  appId: "1:1270657710:web:3473702c56747e9021b33f"
};

// Initialize Firebase
 initializeApp(firebaseConfig);
 export const db =  getFirestore();