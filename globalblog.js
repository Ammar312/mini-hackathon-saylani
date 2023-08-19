import { initializeApp } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  orderBy,
  serverTimestamp,
  doc,
  deleteDoc,
} from "https://www.gstatic.com/firebasejs/10.2.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBtYYKu04IbwLeIUrhCPU6G_ELCpypQh9k",
  authDomain: "mini-hackathon-e685a.firebaseapp.com",
  projectId: "mini-hackathon-e685a",
  storageBucket: "mini-hackathon-e685a.appspot.com",
  messagingSenderId: "519687811876",
  appId: "1:519687811876:web:97465dc33079a374bcb9b1",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const userName = sessionStorage.getItem("currentUserName");
const username = document.querySelector("#username");
username.innerText = userName;
window.addEventListener("load", () => {
  const q = query(collection(db, "global"), orderBy("createdAt", "desc"));
  const globalBlogSection = document.querySelector("#globalBlogSection");
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    globalBlogSection.innerHTML = "";
    querySnapshot.forEach((doc) => {
      const post = document.createElement("div");
      post.classList.add("post");
      post.id = doc.data().id;
      const head = document.createElement("div");
      head.classList.add("head");
      const userImg = document.createElement("div");
      userImg.innerHTML = `<i class="bi bi-person"></i>`;
      userImg.classList.add("userImg");
      const head2Div = document.createElement("div");
      head2Div.classList.add("head2Div");
      const title = document.createElement("div");
      title.classList.add("title");
      title.innerText = doc.data().title;
      const displayName = document.createElement("div");
      displayName.classList.add("displayName");
      displayName.innerText = userName;
      head2Div.appendChild(title);
      head2Div.appendChild(displayName);
      head.appendChild(userImg);
      head.appendChild(head2Div);

      const inputText = document.createElement("div");
      inputText.classList.add("inputText");
      inputText.innerText = doc.data().inputText;
      post.appendChild(head);
      post.appendChild(inputText);

      globalBlogSection.appendChild(post);
    });
  });
});
