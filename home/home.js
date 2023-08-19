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
import {
  getAuth,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.2.0/firebase-auth.js";

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

const auth = getAuth();
const userName = sessionStorage.getItem("currentUserName");
const currentUserUID = sessionStorage.getItem("currentUserUID");
onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/auth.user
    const uid = user.uid;
    console.log(user);
    const blogForm = document.querySelector("#blogForm");
    blogForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const title = document.querySelector("#title").value;
      const inputText = document.querySelector("#inputText").value;
      console.log(inputText);
      try {
        const docRef = await addDoc(collection(db, currentUserUID), {
          title: title,
          inputText: inputText,
          createdAt: serverTimestamp(),
        });
        const globalBlog = await addDoc(collection(db, "global"), {
          title: title,
          inputText: inputText,
          createdAt: serverTimestamp(),
        });
        // form.reset();
        console.log("Document written with ID: ", docRef.id);
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    });

    // ...
  } else {
    // User is signed out
    // ...
    console.log("error");
  }
});

window.addEventListener("load", () => {
  const q = query(collection(db, currentUserUID), orderBy("createdAt", "desc"));
  const blogSection = document.querySelector("#blogSection");
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    blogSection.innerHTML = "";
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
      post.appendChild(deleteBtn);
      post.appendChild(editBtn);
      blogSection.appendChild(post);
      deleteBtn.addEventListener("click", () => deletePostFunc(doc.id));
      editBtn.addEventListener("click", () =>
        editPostFunc(doc.id, doc.data().inputText)
      );
    });
  });
});
