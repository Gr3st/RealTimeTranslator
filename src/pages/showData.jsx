import { firestore } from "../firebase";
import { addDoc, collection, doc, setDoc, getDocs, updateDoc, getDoc, query, where, onSnapshot } from "@firebase/firestore";
import React, { useState, useEffect, useRef } from "react";
import { auth } from "../firebase";
import { useAuthState } from 'react-firebase-hooks/auth';

export default function ShowData(props) {
    const [text, setText] = useState("");
    const [lang, setLang] = useState("");
    const [user] = useAuthState(auth);
    const [check, setCheck] = useState(false);
    const prevPropsState = useRef();

    const getData = async () => {
        const userCollectionRef = collection(firestore, "users");
        const q = query(userCollectionRef, where("uid", "==", user.uid));
        const querySnapshot = await getDocs(q);

        const collectionRef = collection(firestore, "Translator");
        const docRef = doc(collectionRef, querySnapshot.docs[0].data().server);
        const docSnap = await getDoc(docRef);
      
        const unsubscribe = onSnapshot(docRef, (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                if(data.currentUser == user.uid){
                    setCheck(true);
                } else {
                    setCheck(false);
                }
                console.log(data.text);
                setText(data.text);
                setLang(querySnapshot.docs[0].data().lang);
            }
                    });
            
                    // Unsubscribe from realtime updates when the component unmounts
                    return unsubscribe;
    };

    useEffect(() => {
        if (prevPropsState.current !== props.state) {
            getData();
            prevPropsState.current = props.state;
        }
    }, [props.state]);

    return(
        <div>
            {check ? "Waiting for message..." : (<div>{text !== "" ? text : ""}
            <br /></div>)}
        </div>
    );
}



// import { firestore } from "../firebase";
// import { collection, doc, getDocs, query, where, onSnapshot } from "@firebase/firestore";
// import React, { useState, useEffect } from "react";
// import { auth } from "../firebase";
// import { useAuthState } from 'react-firebase-hooks/auth';

// export default function ShowData(props) {
//     const [text, setText] = useState("");
//     const [lang, setLang] = useState("");
//     const [user] = useAuthState(auth);

//     const getData = async () => {
//         const userCollectionRef = collection(firestore, "users");
//         const q = query(userCollectionRef, where("uid", "==", user.uid));
//         const querySnapshot = await getDocs(q);

//         const collectionRef = collection(firestore, "Translator");
//         const docRef = doc(collectionRef, querySnapshot.docs[0].data().server);
        
//         // Listen for realtime updates
//         const unsubscribe = onSnapshot(docRef, (docSnap) => {
//             if (docSnap.exists()) {
//                 const data = docSnap.data();
//                 setText(data.text);
//                 setLang(querySnapshot.docs[0].data().lang);
//             }
//         });

//         // Unsubscribe from realtime updates when the component unmounts
//         return unsubscribe;
//     };

//     useEffect(() => {
//         getData();
//     }, [props.state]);

//     return(
//         <div>
//             {text !== "" ? text : ""}
//             <br />
//             {<div><span>Lang</span><br />{lang}</div>}
//         </div>
//     );
// }
