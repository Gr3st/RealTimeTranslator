import Axios from "axios";
import { useState, useEffect } from "react";
import { getDocs, collection, doc, setDoc } from "firebase/firestore";
import { firestore } from "../firebase";
import { auth } from "../firebase";
import { useAuthState } from 'react-firebase-hooks/auth';

export default function SendData() {
  const [s, setS] = useState("");
  const [da, setDa] = useState("");
  const la = "en";
  const [user] = useAuthState(auth);
 
  useEffect(() => {
    
    if (s !== "" & s.length < 500) {
      Axios.get(
        `https://api.mymemory.translated.net/get?q=${s}&langpair=${props.lang}|${la}`
      ).then((res) => {
        setDa(res.data.responseData.translatedText);
        console.log(s.length);
      });
    }

  }, [s]);
  
  const send = async () => {
    
    const docRef = doc(firestore, 'Translator', props.idServ);

    let data = {
      text: da,
      lang: props.lang,
      currentUser: props.idUser
    };
    try {
      await setDoc(docRef, data);
      console.log("Send to ID:", docRef.id);
    } catch (error) {
      console.error("Error adding document:", error);
    }
  
  };

  return (
    <div className="App">
      <input
        type="text"
        onChange={(event) => {
          setS(event.target.value);
        }}
      ></input>
      <button type="submit" onClick={send}>
        send
      </button>
      <h1>{da}</h1>
    </div>
  );
}