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
  getDocs,
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
          id: generateUniqueId(),
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
      post.id = doc.data().id;
      const title = document.createElement("div");
      title.classList.add("title");
      title.innerText = doc.data().title;
      const inputText = document.createElement("div");
      inputText.classList.add("inputText");
      inputText.innerText = doc.data().inputText;

      const deleteBtn = document.createElement("button");
      deleteBtn.classList.add("btn");
      deleteBtn.id = `${doc.data().id}`;
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
      deleteBtn.addEventListener("click", () =>
        deletePostFunc(doc.id, doc.data().id)
      );
      //   editBtn.addEventListener("click", () =>
      //     editPostFunc(doc.id, doc.data().inputText)
      //   );
    });
  });
});

const deletePostFunc = async (id, globalId) => {
  try {
    // Delete from user's personal collection
    await deleteDoc(doc(db, currentUserUID, id));

    // Delete from global collection
    const globalQuerySnapshot = await getDocs(
      query(collection(db, "global"), where("id", "==", globalId))
    );
    globalQuerySnapshot.forEach(async (doc) => {
      if (doc.data().id === globalId) {
        await deleteDoc(doc.ref);
      }
    });

    console.log("Document deleted successfully");
  } catch (error) {
    console.error("Error deleting document: ", error);
  }
};

const generateUniqueId = () => {
  const characters =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const length = 10;
  let uniqueId = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    uniqueId += characters.charAt(randomIndex);
  }
  return `id-${uniqueId}`;
};
