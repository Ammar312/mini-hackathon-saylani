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
const username = (document.querySelector("#username").innerText = userName);
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
      const blogId = generateUniqueId();
      const title = document.querySelector("#title").value;
      const inputText = document.querySelector("#inputText").value;
      console.log(inputText);
      try {
        const docRef = await addDoc(collection(db, currentUserUID), {
          title: title,
          inputText: inputText,
          id: blogId,
          createdAt: serverTimestamp(),
        });
        const globalBlog = await addDoc(collection(db, "global"), {
          title: title,
          inputText: inputText,
          id: blogId,
          createdAt: serverTimestamp(),
        });
        blogForm.reset();
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

      const btnDiv = document.createElement("div");
      btnDiv.classList.add("btnDiv");
      const deleteBtn = document.createElement("button");
      deleteBtn.classList.add("btn");
      deleteBtn.id = `${doc.data().id}`;
      deleteBtn.innerText = "Delete";

      const editBtn = document.createElement("button");
      editBtn.classList.add("btn");
      editBtn.id = `${doc.id}`;
      editBtn.innerText = "Edit";
      btnDiv.appendChild(deleteBtn);
      btnDiv.appendChild(editBtn);
      post.appendChild(head);
      post.appendChild(inputText);
      post.appendChild(btnDiv);

      blogSection.appendChild(post);
      deleteBtn.addEventListener("click", () =>
        deletePostFunc(doc.id, doc.data().title)
      );
      editBtn.addEventListener("click", () =>
        editPostFunc(doc.id, doc.data().title, doc.data().inputText)
      );
    });
  });
});

const deletePostFunc = async (id, globalId) => {
  try {
    // Delete from user's personal collection
    await deleteDoc(doc(db, currentUserUID, id));

    // Delete from global collection
    const globalQuerySnapshot = await getDocs(
      query(collection(db, "global"), where("title", "==", globalId))
    );
    globalQuerySnapshot.forEach(async (doc) => {
      if (doc.data().title === globalId) {
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

const editPostFunc = (id, title, text) => {
  document.querySelector("#editFormDiv").style.display = "block";
  const editForm = document.querySelector("#editForm");
  const editFormTitle = document.querySelector("#editFormTitle");
  const editFormText = document.querySelector("#editFormText");
  editFormTitle.value = title;
  editFormText.value = text;
  editForm.addEventListener("submit", (e) => {
    e.preventDefault();
    document.querySelector("#editFormDiv").style.display = "none";
  });
};

const cross = document.querySelector("#cross");
cross.addEventListener("click", () => {
  const editFormDiv = document.querySelector("#editFormDiv");
  editFormDiv.style.display = "none";
});
