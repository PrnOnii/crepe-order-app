// src/firebase.js
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyAKM_YA5okV2P5CmqZ2LBIZgfNHbQj_CJA",
    authDomain: "crepe-order-app.firebaseapp.com",
    projectId: "crepe-order-app",
    storageBucket: "crepe-order-app.firebasestorage.app",
    messagingSenderId: "501581355900",
    appId: "1:501581355900:web:cd4b3fa5437b90454022f9"  
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)