import "./index.css";
// components
import Login from "./pages/login";
import SetUserServer from "./pages/setUserServer";
import JoinUserServer from "./pages/joinUserServer";
import Connection from "./pages/check/connnection";
import ShowData from "./pages/showData";
import SendData from "./pages/sendData";
import DisconectUserServer from "./pages/disconectUserServer";
// hooks
import { BrowserRouter as Router, Routes, Switch, Route, Link } from "react-router-dom";
import React, { useEffect, useState } from "react";



function App() {
  const [connected, setConnected] = useState(false);
  const [text, setText] = useState("");

  const handleCheckConnection = (isConnected) => {
    setConnected(isConnected);
    setText(<ShowData state={connected}/>);
  };

    
  
  return (
    <div className="App">
      
      

      <Router>
       
        <div id="panel">
         
          <button type="button" id="linkSUB">
            <Link to="/join">Join</Link>
          </button>
          <button type="button" id="linkSUB">
            <Link to="/generate">Generate</Link>
          </button>
          <button type="button" id="linkSUBlast">
            <Link to="/send">Type</Link>
          </button>
          <button type="button" id="linkSUBserver">
            {/* <button type="button" id="linkSUBhome">
              <Link to="/">Home</Link>
            </button> */}
            <Connection onCheckConnection={handleCheckConnection} />
          </button>
        
          <button type="button" id="linkSUBlogin">
            <Login />
          </button>
        </div>
        <Routes>
          {/* <Route path="/" element={<Login />} /> */}
          <Route path="/generate" element={<SetUserServer />}/> 
          <Route path="/join" element={<JoinUserServer />}/> 
          <Route path="/send" element={<SendData />}/>
        
        </Routes>
        
      </Router>
      
      {/* {connected?:""} */}
      {connected?(
            <div id="message">
              {/* <DisconectUserServer /> */}
               <button type="button" id="showBTN"><span>Message: </span>{text}</button>
            </div>):""}
    </div>
  );
}

export default App;