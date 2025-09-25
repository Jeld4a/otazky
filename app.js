// Firebase SDK (předpokládá, že script je vložen v HTML)
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// Vlož sem svou Firebase konfiguraci
const firebaseConfig = {
  apiKey: "AIzaSyBU1LmKS9jERX_ftsYWYhzBqJUa7tcCjN4",
  authDomain: "celorocni-hra.firebaseapp.com",
  projectId: "celorocni-hra",
  storageBucket: "celorocni-hra.firebasestorage.app",
  messagingSenderId: "735682192013",
  appId: "1:735682192013:web:b8ec900af674ed61a4b8c4",
  measurementId: "G-MQP85DHVLB"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const quizDiv = document.getElementById("quiz");
const boxesDiv = document.getElementById("boxes");
const gameLink = document.getElementById("game-link");

// Unikátní ID uživatele (pro jednoduchost: localStorage)
let userId = localStorage.getItem("userId");
if (!userId) {
  userId = "user_" + Date.now();
  localStorage.setItem("userId", userId);
}

// načtení stavu z Firestore
let correctAnswers = Array(questions.length).fill(false);

async function loadProgress() {
  const docRef = doc(db, "quizProgress", userId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    correctAnswers = docSnap.data().correctAnswers;
  }
  renderQuiz();
}

async function saveProgress() {
  await setDoc(doc(db, "quizProgress", userId), { correctAnswers });
}

function renderQuiz() {
  quizDiv.innerHTML = "";
  questions.forEach((item, index) => {
    const div = document.createElement("div");
    div.className = "question";
    const inputDisabled = correctAnswers[index] ? "disabled" : "";
    div.innerHTML = `
      <label>${item.q}</label>
      <input type="text" id="answer-${index}" ${inputDisabled}>
      <button onclick="checkAnswer(${index})" ${inputDisabled}>Odeslat</button>
    `;
    quizDiv.appendChild(div);
  });
  renderBoxes();
}

function renderBoxes() {
  boxesDiv.innerHTML = "";
  correctAnswers.forEach(correct => {
    const box = document.createElement("div");
    box.className = "box" + (correct ? " correct" : "");
    boxesDiv.appendChild(box);
  });
  if (correctAnswers.every(x => x)) gameLink.style.display = "block";
}

window.checkAnswer = async function(index) {
  const input = document.getElementById(`answer-${index}`);
  if (input.value.trim().toLowerCase() === questions[index].a.toLowerCase()) {
    correctAnswers[index] = true;
    await saveProgress();
    renderQuiz();
  } else {
    alert("Špatně, zkus to znovu!");
  }
};

loadProgress();
