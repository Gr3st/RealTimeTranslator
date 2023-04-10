import Axios from "axios";
import { useState, useEffect } from "react";
import { getDocs, collection, doc, setDoc, query, where } from "firebase/firestore";
import { firestore } from "../firebase";
import { auth } from "../firebase";
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from "react-router-dom";

export default function SendData() {
  const [s, setS] = useState("");
  const [da, setDa] = useState("");
  const [user] = useAuthState(auth);
  const [lang, setLang] = useState("");

  const navigate = useNavigate();
  const la = "en";

  const conectionDB = async () =>{
    const userCollectionRef = collection(firestore, "users");
    const q = query(userCollectionRef, where("uid", "==", user.uid));
    const querySnapshot = await getDocs(q);
    setLang(querySnapshot.docs[0].data().lang);
  };

  useEffect(() => {
    conectionDB();
    if (s !== "" & s.length < 500) {
      Axios.get(
        `https://api.mymemory.translated.net/get?q=${s}&langpair=${lang}|${lang=="en"?"pl":la}`
      ).then((res) => {
        setDa(res.data.responseData.translatedText);
        console.log(s.length);
      });
    }

  }, [s]);
  
  const send = async () => {
    
    const userCollectionRef = collection(firestore, "users");
    const q = query(userCollectionRef, where("uid", "==", user.uid));
    const querySnapshot = await getDocs(q);

    const collectionRef = collection(firestore, "Translator");
    const docRef = doc(collectionRef, querySnapshot.docs[0].data().server);


    let data = {
      text: da,
      lang: querySnapshot.docs[0].data().lang,
      currentUser: user.uid
    };
    try {
      await setDoc(docRef, data);
      console.log("Send to ID:", docRef.id);
      navigate("/");
    } catch (error) {
      console.error("Error adding document:", error);
    }
  
  };

  return (
    <div>
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