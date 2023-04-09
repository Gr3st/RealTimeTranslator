// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDHxaitgntBZEamH47M1OMOZE7WpkfUJ_k",
  authDomain: "react-mess-62c23.firebaseapp.com",
  projectId: "react-mess-62c23",
  storageBucket: "react-mess-62c23.appspot.com",
  messagingSenderId: "139680124034",
  appId: "1:139680124034:web:883f790182f263be49f89b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
