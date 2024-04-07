import { firestore } from "../../firebase";
import { collection, getDocs, query, where,updateDoc, getDoc, doc } from "@firebase/firestore";
import React, { useState, useEffect } from "react";
import { auth } from "../../firebase";
import { useAuthState } from 'react-firebase-hooks/auth';
import { Link } from "react-router-dom";
import DisconectUserServer from "../disconectUserServer";


function Connection ({ onCheckConnection }) {

  const [user] = useAuthState(auth);
  const [connected, setConnected] = useState(false);
  const [serv, setServID] = useState("");
  const [documents, setDocuments] = useState([]);

  const handleJoin = async () => {
    if (user) { // Add a check here
      const userCollectionRef = collection(firestore, "users");
      const q = query(userCollectionRef, where("uid", "==", user.uid));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.docs.length > 0 && querySnapshot.docs[0].data().server !== "") {
        setConnected(true);
        onCheckConnection(true); // pass the result to the parent component
        setServID(querySnapshot.docs[0].data().server);
      } else {
        setConnected(false);
        onCheckConnection(false);
      }
    }
  };
  

  // Function to get all documents from the collection

  const list = async () => {
    const translatorCollectionRef = collection(firestore, "Translator");
    try {
      const querySnapshot = await getDocs(translatorCollectionRef);
      // Map through the documents to extract IDs
      const ids = querySnapshot.docs.map(doc => doc.id);
      setDocuments(ids);
    } catch (error) {
      console.error("Error getting documents: ", error);
      return []; // Jeśli wystąpił błąd, zwróć pustą tablicę
    }
  }
  
 // Definicja stałej S poza funkcją
  
  useEffect(() => {
    list();
    handleJoin();
    
  }, [user?.uid]);
  
  return (
    <div>
      <button type="submit" id="linkSUB">
        <Link to="/">Home</Link>
      </button>
      <button type="submit" id="linkSUB">
        {connected ? (<div>
          <span className="connected">You are connected to ID: </span>{serv}</div>):(<div><span className="disconnected">You are not connected to the server</span></div>)}
      </button>
      <button type="button" id="linkSUBdisconect">
        <DisconectUserServer />
      </button>
        {/* Display the document names */}
      <div>
        <h3>LIST</h3>
        {documents.map((docName, index) => (
          <div key={index}>{docName}</div>
        ))}
      </div>
    </div>
  );
}

export default Connection;


