import { initializeApp } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-app.js";
import {
  getAuth,
  updateProfile,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.2.0/firebase-auth.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBtYYKu04IbwLeIUrhCPU6G_ELCpypQh9k",
  authDomain: "mini-hackathon-e685a.firebaseapp.com",
  projectId: "mini-hackathon-e685a",
  storageBucket: "mini-hackathon-e685a.appspot.com",
  messagingSenderId: "519687811876",
  appId: "1:519687811876:web:97465dc33079a374bcb9b1",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const userName = sessionStorage.getItem("currentUserName");
const username = (document.querySelector("#username").innerText = userName);

const auth = getAuth();
onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/auth.user
    const uid = user.uid;
    console.log(user.auth.currentUser);
    const displayName = document.querySelector("#displayName");
    displayName.value = user.auth.currentUser.displayName;
    // ...
  } else {
    // User is signed out
    // ...
  }
});
