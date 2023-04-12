import { firestore } from "../firebase";
import { addDoc, collection, doc, setDoc, getDocs, updateDoc, getDoc, where, query} from "@firebase/firestore";
import React, { useState, useEffect } from "react";
import { auth } from "../firebase";
import { useAuthState } from 'react-firebase-hooks/auth';

export default function DisconectUserServer (){

    const [user] = useAuthState(auth);


    const handleDisconect = async () => {

            const userCollectionRef = collection(firestore, "users");
            const q = query(userCollectionRef, where("uid", "==", user.uid));
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
              const docRef = doc(firestore, "users", querySnapshot.docs[0].id);
              await updateDoc(docRef, { server: "" });
              
              window.location.reload();
            }
     
      };
      return(
        <div>
            <button type="submit" onClick={handleDisconect}>Disconect</button>
        </div>
      );

}
