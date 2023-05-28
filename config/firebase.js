// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDmaYNkL00ZUXezg_y42li2ZzNPsezRmPQ",
    authDomain: "findmydoggo-69f50.firebaseapp.com",
    projectId: "findmydoggo-69f50",
    storageBucket: "findmydoggo-69f50.appspot.com",
    messagingSenderId: "1073929584007",
    appId: "1:1073929584007:web:abe38ac1088fc044b52722"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const database = getFirestore(app)
export const storage = getStorage(app);