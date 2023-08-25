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
const uid = sessionStorage.getItem("uid");
const name = sessionStorage.getItem("name");
console.log(name);
document.querySelector("#blog").innerText = `All from ${name}`;

// const publishDate = new Date().toDateString();
window.addEventListener("load", () => {
  const q = query(collection(db, uid), orderBy("createdAt", "desc"));
  const globalBlogSection = document.querySelector("#globalBlogSection");
  const picture = document.querySelector("#picture");
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    globalBlogSection.innerHTML = "";
    picture.innerHTML = "";
    querySnapshot.forEach((doc) => {
      //   const globalBlogDiv = document.createElement("div");
      //   globalBlogDiv.classList.add("globalBlogDiv");
      //   const headline = document.createElement("h2");
      //   headline.classList.add("headline");
      //   headline.innerText = `All from ${doc.data().personName}`;
      const post = document.createElement("div");
      post.classList.add("post");
      post.id = doc.data().userUID;
      const head = document.createElement("div");
      head.classList.add("head");
      const userImg = document.createElement("div");
      userImg.style.backgroundImage =
        doc.data().imageURL !== null
          ? `url(${doc.data().imageURL})`
          : "url('../fall.png')";
      // userImg.innerHTML = `<i class="bi bi-person"></i>`;
      userImg.classList.add("userImg");
      const head2Div = document.createElement("div");
      head2Div.classList.add("head2Div");
      const title = document.createElement("div");
      title.classList.add("title");
      title.innerText = doc.data().title;
      const displayNameAndDate = document.createElement("div");
      displayNameAndDate.classList.add("displayNameAndDate");
      const displayName = document.createElement("div");
      displayName.classList.add("displayName");
      displayName.innerText = `${doc.data().personName} `;
      const dateString = document.createElement("span");
      dateString.classList.add("dateString");
      dateString.innerText = `- ${doc.data().date}`;
      displayNameAndDate.appendChild(displayName);
      displayNameAndDate.appendChild(dateString);
      head2Div.appendChild(title);
      head2Div.appendChild(displayNameAndDate);
      head.appendChild(userImg);
      head.appendChild(head2Div);

      const inputText = document.createElement("div");
      inputText.classList.add("inputText");
      inputText.innerText = doc.data().inputText;

      post.appendChild(head);
      post.appendChild(inputText);
      //   globalBlogDiv.append(headline);
      //   globalBlogDiv.appendChild(post);
      globalBlogSection.appendChild(post);
      const pictureDiv = document.createElement("div");
      pictureDiv.classList.add("pictureDiv");
      pictureDiv.style.backgroundImage =
        doc.data().imageURL !== null
          ? `url(${doc.data().imageURL})`
          : "url('../fall.png')";

      picture.appendChild(pictureDiv);
    });
  });
});
