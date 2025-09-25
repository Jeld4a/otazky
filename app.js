// ===================== Firebase konfigurace =====================
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

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

// ===================== Pole otázek =====================
const questions = [
  { q: "2 + 2 = ?", a: "4" },
  { q: "Hlavní město ČR?", a: "Praha" },
  { q: "5 * 3 = ?", a: "15" },
  { q: "Barva nebe?", a: "modrá" },
  { q: "První měsíc roku?", a: "leden" },
  { q: "Kolik dní má týden?", a: "7" },
  { q: "Jaký je největší oceán?", a: "Tichý" },
  { q: "Hlavní město Francie?", a: "Paříž" },
  { q: "10 / 2 = ?", a: "5" },
  { q: "Co je H2O?", a: "voda" },
  { q: "Kolik barev má duha?", a: "7" },
  { q: "První písmeno abecedy?", a: "A" },
  { q: "2 * 6 = ?", a: "12" },
  { q: "Hlavní město Německa?", a: "Berlín" },
  { q: "Kolik měsíců má rok?", a: "12" },
  { q: "Jaký je český národní sport?", a: "fotbal" },
  { q: "Slunce vychází na straně?", a: "východ" },
  { q: "Kolik nohou má pes?", a: "4" },
  { q: "Nejvyšší hora světa?", a: "Everest" },
  { q: "Kolik kontinentů je na Zemi?", a: "7" },
  { q: "Jak se jmenuje český prezident?", a: "Petr Pavel" },
  { q: "Jaký je národní symbol USA?", a: "orel" },
  { q: "Co je 9 * 9?", a: "81" },
  { q: "Hlavní město Itálie?", a: "Řím" },
  { q: "Jaký je chemický symbol zlata?", a: "Au" },
  { q: "Kolik planet je ve sluneční soustavě?", a: "8" },
  { q: "Co je fotosyntéza?", a: "proces" },
  { q: "Kolik sekund je v minutě?", a: "60" },
  { q: "Hlavní město Španělska?", a: "Madrid" },
  { q: "Jaký je nejrychlejší suchozemský zvíře?", a: "gepard" }
];

// ===================== DOM elementy =====================
const quizDiv = document.getElementById("quiz");
const boxesDiv = document.getElementById("boxes");
const gameLink = document.getElementById("game-link");

// ===================== Uživatelský ID =====================
let userId = localStorage.getItem("userId");
if (!userId) {
  userId = "user_" + Date.now();
  localStorage.setItem("userId", userId);
}

// ===================== Stav otázek =====================
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

// ===================== Vykreslení kvízu =====================
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

// ===================== Kostičky =====================
function renderBoxes() {
  boxesDiv.innerHTML = "";
  correctAnswers.forEach(correct => {
    const box = document.createElement("div");
    box.className = "box" + (correct ? " correct" : "");
    boxesDiv.appendChild(box);
  });
  if (correctAnswers.every(x => x)) gameLink.style.display = "block";
}

// ===================== Kontrola odpovědi =====================
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

// ===================== Spuštění =====================
loadProgress();
