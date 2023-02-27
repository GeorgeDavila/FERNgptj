import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import "./Wryyt.css";
import "./bootstrap.min.css";
import { auth, db, logout } from "./firebase";
import { query, collection, getDocs, where } from "firebase/firestore";

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import NLG from "./NLGfuncs.js";
import {useRef} from 'react';

function Wryyt() {
  const [user, loading, error] = useAuthState(auth);
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const [value, setValue] = useState('');

  const fetchUserName = async () => {
    try {
      const q = query(collection(db, "users"), where("uid", "==", user?.uid));
      const doc = await getDocs(q);
      const data = doc.docs[0].data();

      setName(data.name);
    } catch (err) {
      console.error(err);
      alert("An error occured while fetching user data");
    }
  };

  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/");
    fetchUserName();
  }, [user, loading]);

  const ref = useRef(null);
  
  const handleClick = () => { //https://bobbyhadz.com/blog/react-get-element-by-id
    // 👇️ use document.getElementById()
    const el = document.getElementById('aiText').value;
    let loader = `<div class="lds-hourglass"></div>`
	  document.getElementById('loaderAnimation').innerHTML =  `<div class="lds-hourglass"></div>`;
    //console.log(el);
    //alert(el);
    let aiOutputSanitized = NLG(el).then((value) => {
      console.log(value);
      document.getElementById("aiText").value = `${value}`;
      document.getElementById('loaderAnimation').innerHTML = ``;
      // expected output: "Success!"
    });;
    
    //aiOutputSanitized = aiOutputSanitized;
    //console.log(aiOutputSanitized);
    //aiOutputSanitized = JSON.stringify(aiOutputSanitized[0]).slice(1, -1);

    //document.getElementById("aiText").value = `${aiOutputSanitized}` //add it to the html 
	  //document.getElementById('loaderAnimation').innerHTML = ``; //re-empty loading animation

    // 👇️ (better) use a ref
    //const el2 = ref.current;
    //console.log(el2);
  };

  const modules  = {
    toolbar: [
        [{ font: [] }],
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ color: [] }, { background: [] }],
        [{ script:  "sub" }, { script:  "super" }],
        ["blockquote", "code-block"],
        [{ list:  "ordered" }, { list:  "bullet" }],
        [{ indent:  "-1" }, { indent:  "+1" }, { align: [] }],
        ["link", "image", "video"],
        ["clean"],
    ],
};

  const addToEditor = () => { 
    let aiText2Write = document.getElementById('aiText').value;

    let userTextExisting= document.getElementById("userText").value;

    document.getElementById("userText").value = `${userTextExisting} ${aiText2Write}`;

    document.getElementById('aiText').value = ``;
  };

  return (
    <div className="wryytPage">
      <ul className="animate-navbar">
        <li><a className="active" href="index.html">Write!</a></li>
        <li><a href="./read">Read!</a></li>
        <li><a href="settings.html">Settings</a></li>
        <li><a href="UserGuide.html">User Guide</a></li>
        <li><a href="https://wryyt.com">About</a></li>
        <li><p>Hi {name}!</p></li>
        <li><p>{user?.email}</p></li>
        <li><p className="logoutButton" onClick={logout}>Logout</p></li>
      </ul>
      <h1 className="animate-charLinear">WRYYT</h1>
      <div className="row">
        <div className="row">
        <div className="column">
          <textarea placeholder="Your AI generated text will appear here." id="aiText" name="aiText" rows="3"></textarea>
          <button className="btn writeText" onClick={handleClick}>Write!</button>
          <button className="btn useAIText" onClick={addToEditor}>Use this Writing!</button>
          <p id="loaderAnimation"></p>
        </div>
        <div className="column">
          <div id="editor">
            <textarea placeholder="Write your masterpiece here..." id="userText" name="userText" rows="15"></textarea>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}

export default Wryyt;
