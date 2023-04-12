import "../index.css";
import { firestore } from "../firebase";
import { addDoc, collection } from "@firebase/firestore";
import React, { useState } from "react";
import { auth, provider } from "../firebase";
import { signInWithPopup, signOut } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";

export default function Login() {
  const ref = collection(firestore, "users");
  const [user] = useAuthState(auth);
  const [langRef, setLangRef] = useState("");

  const signInWithGoogle = async () => {
    if(langRef!==""){
        await signInWithPopup(auth, provider);
        
        let data = {
        displayName: auth.currentUser?.displayName,
        email: auth.currentUser?.email,
        photoURL: auth.currentUser?.photoURL,
        lang: langRef.toLowerCase(),
        server: "",
        uid: auth.currentUser?.uid
        };
        addDoc(ref, data);
    }else{
        console.error("Error updating");
    }
  };
  const handleLogout = async () => {
    await signOut(auth);
    window.location.reload();
  };
  const handleSelectChange = (event) => {
    setLangRef(event.target.value);
  };

  return (
    <div className="Login">
      {user ? (
        <div>
          <button type="button" id="buttonVisLog">{auth.currentUser.email}</button>
          
          <button onClick={handleLogout}>Log out</button>
        </div>
      ) : (
        <div>
          <select value={langRef} onChange={handleSelectChange}>
            <option value="">Wybierz Jezyk</option>
            <option value="pl">polish</option>
            <option value="en">english</option>
            <option value="it">italy</option>
            <option value="ru">russian</option>
          </select>
          {/* <input type="text" onChange={} placeholder="Podaj swoj jezyk"></input> */}
          <button onClick={signInWithGoogle}>Sign In with Google</button>
        </div>
      )}

    </div>
  );
}
