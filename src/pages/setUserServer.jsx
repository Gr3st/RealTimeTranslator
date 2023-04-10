import { firestore } from "../firebase";
import "../index.css";
import { addDoc, collection, doc, setDoc, getDocs, updateDoc, getDoc, where, query} from "@firebase/firestore";
import React, { useState, useEffect } from "react";
import { auth } from "../firebase";
import { useAuthState } from 'react-firebase-hooks/auth';


function SetUserServer (props) {
    const [id, setIdUser] = useState(null);
    const [user] = useAuthState(auth);
    const [generateNumber, setGenerateNumber] = useState("");


    function generateRandNum() {
        const randomNumber = Math.floor(Math.random() * 1000000);
        return randomNumber.toString().padStart(6, "0");
    }
    
    const myRandomNumber = generateRandNum();
  
    const addDocumentWithID = async (id, data) => {
      const docRef = doc(firestore, "Translator", id);
      try {
        await setDoc(docRef, data);
        console.log("Generated ID:", docRef.id);
      } catch (error) {
        console.error("Error adding document:", error);
      }
    };
  
    const handleClick = async () => {
        addDocumentWithID(myRandomNumber, {
            text: " "
          });
        setGenerateNumber(myRandomNumber);
        const userCollectionRef = collection(firestore, "users");
        const q = query(userCollectionRef, where("uid", "==", user.uid));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const docRef = doc(firestore, "users", querySnapshot.docs[0].id);
          await updateDoc(docRef, { server: myRandomNumber });
          window.location.reload();
        }
        };
    return (
        <div>
          <br />
          {user?(<div><button type="submit" onClick={handleClick}>
            CREATE NEW SERVER
          </button></div>):(<div id="buttonVis"><button type="button">Zaloguj sie aby generować server</button></div>)}
            {generateNumber!=""?(<div id="buttonVis"><button type="button">{generateNumber}</button></div>):""}
        </div>
      );
  }
  
  export default SetUserServer;
