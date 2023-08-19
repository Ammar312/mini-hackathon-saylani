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

window.addEventListener("load", () => {
  const q = query(collection(db, "global"), orderBy("createdAt", "desc"));
  const globalBlogSection = document.querySelector("#globalBlogSection");
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    globalBlogSection.innerHTML = "";
    querySnapshot.forEach((doc) => {
      const post = document.createElement("div");
      // post.innerText = doc.data().inputText;
      post.classList.add("post");
      const title = document.createElement("div");
      title.classList.add("title");
      title.innerText = doc.data().title;
      const inputText = document.createElement("div");
      inputText.classList.add("inputText");
      inputText.innerText = doc.data().inputText;

      const deleteBtn = document.createElement("button");
      deleteBtn.classList.add("btn");
      deleteBtn.id = `${doc.id}`;
      deleteBtn.innerText = "Delete";

      const editBtn = document.createElement("button");
      editBtn.classList.add("btn");
      editBtn.id = `${doc.id}`;
      editBtn.innerText = "Edit";
      post.appendChild(title);
      post.appendChild(inputText);
      // post.appendChild(deleteBtn);
      // post.appendChild(editBtn);
      globalBlogSection.appendChild(post);
      // deleteBtn.addEventListener("click", () => deletePostFunc(doc.id));
      // editBtn.addEventListener("click", () =>
      //   editPostFunc(doc.id, doc.data().inputText)
      // );
    });
  });
});
