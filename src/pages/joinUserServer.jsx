import { firestore } from "../firebase";
import { addDoc, collection, doc, setDoc, getDocs, updateDoc, getDoc, where, query} from "@firebase/firestore";
import React, { useState, useEffect } from "react";
import { auth } from "../firebase";
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from "react-router-dom";

function JoinUserServer (){
    const [join, setJoin] = useState("");
    const [error, setError] = useState(false);
    // const [lang, setLang] = useState("");
    // const [puser, setPuser] = useState("");
    // const [text, setText] = useState("");
    const [user] = useAuthState(auth);
    const navigate = useNavigate();

    const handleJoin = async () => {
        const collectionRef = collection(firestore, "Translator");
        const docRef = doc(collectionRef, join);
      
        try {
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            // setLang(data.lang);
            // setText(data.text);
            // setPuser(data);
            const userCollectionRef = collection(firestore, "users");
            const q = query(userCollectionRef, where("uid", "==", user.uid));
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
              const docRef = doc(firestore, "users", querySnapshot.docs[0].id);
              await updateDoc(docRef, { server: join });
              navigate("/");
              window.location.reload();
              setError(false);
            }
          } else {
            console.log("No such document!");
            setError(true);
          }
        } catch (error) { 
          console.error("Error getting document:", error);
        }
     
      };
      return(
        <div>
            <input type="text" id="linkSUBJOIN" placeholder="podaj id" onChange={(event)=> setJoin
            (event.target.value)} />
            <br />
            {error?(window.alert("No such document!")):""}
            
            <button type="submit" onClick={handleJoin}>Join</button>
        </div>
      );

}

export default JoinUserServer;