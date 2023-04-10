import { firestore } from "../../firebase";
import { collection, getDocs, query, where } from "@firebase/firestore";
import React, { useState, useEffect } from "react";
import { auth } from "../../firebase";
import { useAuthState } from 'react-firebase-hooks/auth';

function Connection ({ onCheckConnection }) {

  const [user] = useAuthState(auth);
  const [connected, setConnected] = useState(false);
  const [serv, setServID] = useState("");

  const handleJoin = async () => {
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
  };

  useEffect(() => {
    handleJoin();
  }, [user?.uid]);

  return (
    <div>
    
        <button type="submit">
          {connected ? (<div>
        <span class="connected">You are connected to ID: </span>{serv}</div>):(<div><span class="disconnected">You are not connected to the server</span></div>)}
        </button>
      
    </div>
  );
}

export default Connection;

