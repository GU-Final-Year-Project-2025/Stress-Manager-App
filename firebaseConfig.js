// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; 

const firebaseConfig = {
    apiKey: "AIzaSyB9eQGJdEyr9g5mVMa3KdV-BeXbaIL4w7Y",
    authDomain: "stress-manager-29c5a.firebaseapp.com",
    projectId: "stress-manager-29c5a",
    storageBucket: "stress-manager-29c5a.firebasestorage.app",
    messagingSenderId: "882571647920",
    appId: "1:882571647920:web:027cedcad9a0c2f86d9475"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
