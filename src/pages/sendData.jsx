import Axios from "axios";
import { useState, useEffect } from "react";
import { getDocs, collection, doc, setDoc, query, where, getDoc } from "firebase/firestore";
import { firestore } from "../firebase";
import { auth } from "../firebase";
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from "react-router-dom";

import SpeechRecognition, {useSpeechRecognition} from "react-speech-recognition";

export default function SendData() {
  const [s, setS] = useState("");
  const [da, setDa] = useState("");
  const [user] = useAuthState(auth);
  const [lang, setLang] = useState("");
  const [langToTranslate, setLangToTranslate] = useState("");
  const {
    transcript,
    listening,
    browserSupportsSpeechRecognation,
  } = useSpeechRecognition();
  // if(!browserSupportsSpeechRecognation){
  //   return <span>Tour browser doesn't support Speech Recognation</span>
  // }

  const startListening = () => SpeechRecognition.startListening({ language: lang });

  const navigate = useNavigate();
  // const la = "en";
 

  const conectionDB = async () =>{
    const userCollectionRef = collection(firestore, "users");
    const q = query(userCollectionRef, where("uid", "==", user.uid));
    const querySnapshot = await getDocs(q);
    setLang(querySnapshot.docs[0].data().lang);
  };
  
  const conectionTranslatorDB = async () => {
    const userCollectionRef = collection(firestore, "users");
    const q = query(userCollectionRef, where("uid", "==", user.uid));
    const querySnapshot = await getDocs(q);

    const collectionRef = collection(firestore, "Translator");
    const docRef = doc(collectionRef, querySnapshot.docs[0].data().server);
    const docSnapshot = await getDoc(docRef);
    setLangToTranslate(docSnapshot.data().lang);
  };
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
      window.location.reload();
    } catch (error) {
      console.error("Error adding document:", error);
    }
  
  };
  

  useEffect(() => {
    conectionDB();
    conectionTranslatorDB();

    console.log(lang);
    console.log(langToTranslate);
    
    
    if (s !== "" && s.length < 500 && lang!=="" && langToTranslate!=="") {
      Axios.get(
        `https://api.mymemory.translated.net/get?q=${s}&langpair=${lang}|${langToTranslate}`
      ).then((res) => {
        setDa(res.data.responseData.translatedText);
        console.log(s.length);
      });
    }
  
  }, [s]);
  

  useEffect(() => {
    setS(transcript);
  }, [transcript]);
  return (
    <div>
      {/* <input
        type="text" id="setText"
        onChange={(event) => {
          setS(event.target.value);
        }}
      ></input><br /> */}
      <button onClick={startListening}>Start</button><br />
      <button onClick={SpeechRecognition.stopListening}>Stop</button><br />
      
      {/* <input
          type="text"
          value={transcript}
          onChange={(event) => setS(event.target.value)}
        />
        
      <br />{s} */}
      {s!==""?s:""}
      <br />
      <button type="button" id="showText">{da!==""?da:"message..."}</button><br />
      <div className="justBTN">
        <button type="submit" id="sendBTN" onClick={send}>
          send
        </button>
      </div>
    </div>
  );
}

// import Axios from "axios";
// import { useState, useEffect } from "react";
// import { getDocs, collection, doc, setDoc, query, where } from "firebase/firestore";
// import { firestore } from "../firebase";
// import { auth } from "../firebase";
// import { useAuthState } from 'react-firebase-hooks/auth';
// import { useNavigate } from "react-router-dom";
// import SpeechRecognition, {useSpeechRecognition} from "react-speech-recognition";

// export default function SendData() {
//   const [s, setS] = useState("");
//   const [da, setDa] = useState("");
//   const [user] = useAuthState(auth);
//   const [lang, setLang] = useState("");
//   const {
//         transcript,
//         listening,
//         browserSupportsSpeechRecognation
//       } = useSpeechRecognition();
//   const navigate = useNavigate();
//   const la = "en";

//   const conectionDB = async () =>{
//     const userCollectionRef = collection(firestore, "users");
//     const q = query(userCollectionRef, where("uid", "==", user.uid));
//     const querySnapshot = await getDocs(q);
//     setLang(querySnapshot.docs[0].data().lang);
//   };
//   const send = async () => {
    
//     const userCollectionRef = collection(firestore, "users");
//     const q = query(userCollectionRef, where("uid", "==", user.uid));
//     const querySnapshot = await getDocs(q);

//     const collectionRef = collection(firestore, "Translator");
//     const docRef = doc(collectionRef, querySnapshot.docs[0].data().server);


//     let data = {
//       text: da,
//       lang: querySnapshot.docs[0].data().lang,
//       currentUser: user.uid
//     };
//     try {
//       await setDoc(docRef, data);
//       console.log("Send to ID:", docRef.id);
//       // navigate("/");
//       // window.location.reload();
//     } catch (error) {
//       console.error("Error adding document:", error);
//     }
  
//   };

//   useEffect(() => {
//     conectionDB();
//     if (s != "" && s.length < 500 && lang!="") {
//       Axios.get(
//         `https://api.mymemory.translated.net/get?q=${s}&langpair=${lang}|${lang=="en"?"pl":la}`
//       ).then((res) => {
//         setDa(res.data.responseData.translatedText);
//         console.log(s.length);
//       });
//     }
//     send();
//   }, [s]);
  
//   useEffect(() => {
//     setS(transcript);
//   }, [transcript]);
//   return (
//     <div>
//       {/* <input
//         type="text" id="setText"
//         onChange={(event) => {
//           setS(event.target.value);
//         }}
//       ></input> */}
//       <button onClick={SpeechRecognition.startListening}>Start</button><br />
//       <button onClick={SpeechRecognition.stopListening}>Stop</button><br />
//       <button type="submit" onClick={send}>
//         send
//       </button><br />
//       <button type="button" id="showText">{da!=""?da:"message..."}</button>
//     </div>
//   );
// }