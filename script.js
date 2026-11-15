/**
 * Romantic Dating Invitation – WhatsApp Answer Submission
 * -------------------------------------------------------
 * CONFIGURATION: Change the number below to your WhatsApp number.
 * Use international format WITHOUT the + sign.
 * Example for Tanzania: 255712345678
 * Example for Kenya:   254712345678
 */
const WHATSAPP_NUMBER = "255765752918"; // <-- Your WhatsApp number (international format, no +)

// ===== Questions (Kiswahili) =====
const QUESTIONS = [
  "Je, ungependa kudate na mimi?",
  "Je, uko tayari kunipa nafasi ya kukufahamu zaidi?",
  "Ungependa tutumie muda pamoja na kwenda sehemu nzuri?",
  "Ungependa tuwe tunawasiliana kila siku?",
  "Je, ungependa niwe mtu wako maalumu?",
  "Je, utakubali kuwa girlfriend wangu?"
];

// ===== State =====
let currentQuestionIndex = 0;
let answers = [];           // stores "NDIYO ❤️" or "HAPANA"
let userName = "";

// ===== DOM Elements =====
const screens = {
  welcome: document.getElementById("welcome-screen"),
  question: document.getElementById("question-screen"),
  softNo: document.getElementById("soft-no-screen"),
  confirmation: document.getElementById("confirmation-screen"),
  later: document.getElementById("later-screen"),
  whatsappOpened: document.getElementById("whatsapp-opened-screen"),
  celebration: document.getElementById("celebration-screen")
};

const els = {
  startBtn: document.getElementById("startBtn"),
  userNameInput: document.getElementById("userName"),
  questionText: document.getElementById("questionText"),
  questionCounter: document.getElementById("questionCounter"),
  progressFill: document.getElementById("progressFill"),
  yesBtn: document.getElementById("yesBtn"),
  noBtn: document.getElementById("noBtn"),
  yesWhatsAppBtn: document.getElementById("yesWhatsAppBtn"),
  noWhatsAppBtn: document.getElementById("noWhatsAppBtn"),
  backToConfirmBtn: document.getElementById("backToConfirmBtn"),
  restartFromLaterBtn: document.getElementById("restartFromLaterBtn"),
  restartFromNoBtn: document.getElementById("restartFromNoBtn"),
  openWhatsAppAgainBtn: document.getElementById("openWhatsAppAgainBtn"),
  backFromOpenedBtn: document.getElementById("backFromOpenedBtn")
};

// ===== Floating Hearts =====
function createFloatingHearts() {
  const container = document.getElementById("bgHearts");
  const hearts = ["💖", "❤️", "💕", "💗", "💓", "💞"];
  for (let i = 0; i < 18; i++) {
    const heart = document.createElement("span");
    heart.className = "floating-heart";
    heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
    heart.style.left = Math.random() * 100 + "%";
    heart.style.animationDuration = (8 + Math.random() * 12) + "s";
    heart.style.animationDelay = (Math.random() * 10) + "s";
    heart.style.fontSize = (14 + Math.random() * 18) + "px";
    container.appendChild(heart);
  }
}

// ===== Screen Navigation =====
function showScreen(name) {
  Object.values(screens).forEach(s => s.classList.remove("active"));
  if (screens[name]) {
    screens[name].classList.add("active");
  }
}

// ===== Progress =====
function updateProgress() {
  const percent = ((currentQuestionIndex) / QUESTIONS.length) * 100;
  els.progressFill.style.width = percent + "%";
  els.questionCounter.textContent = `Swali ${currentQuestionIndex + 1} / ${QUESTIONS.length}`;
}

// ===== Show Question =====
function showQuestion() {
  if (currentQuestionIndex >= QUESTIONS.length) {
    // All questions answered with YES → go to confirmation
    showScreen("confirmation");
    return;
  }
  els.questionText.textContent = QUESTIONS[currentQuestionIndex];
  updateProgress();
  showScreen("question");
}

// ===== Handle Answer =====
function handleAnswer(isYes) {
  const answerText = isYes ? "NDIYO ❤️" : "HAPANA";
  answers[currentQuestionIndex] = answerText;

  if (!isYes) {
    // Soft exit on any NO
    showScreen("softNo");
    return;
  }

  currentQuestionIndex++;
  if (currentQuestionIndex >= QUESTIONS.length) {
    showScreen("confirmation");
  } else {
    // Small delay for nicer transition feel
    setTimeout(() => showQuestion(), 180);
  }
}

// ===== Build WhatsApp Message =====
function buildWhatsAppMessage() {
  let message = "Habari! ❤️\n";
  message += "Nimekamilisha kujibu maswali yako ya kimapenzi.\n\n";
  message += "MAJIBU YANGU:\n";

  QUESTIONS.forEach((q, i) => {
    const ans = answers[i] || "—";
    message += `${q} — ${ans}\n`;
  });

  if (userName && userName.trim() !== "") {
    message += `\nJina langu: ${userName.trim()}\n`;
  }

  message += "\nNimefurahi kujibu maswali yako! 🥰❤️";
  return message;
}

// ===== Open WhatsApp =====
function openWhatsApp() {
  const message = buildWhatsAppMessage();
  const encoded = encodeURIComponent(message);
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`;

  // Open in new tab / WhatsApp app. User must still press Send.
  const opened = window.open(url, "_blank");

  // Fallback for some mobile browsers that block window.open
  if (!opened || opened.closed || typeof opened.closed === "undefined") {
    window.location.href = url;
  }

  // Show instruction screen
  showScreen("whatsappOpened");
}

// ===== Restart =====
function restart() {
  currentQuestionIndex = 0;
  answers = [];
  // Keep the name if they typed it
  showScreen("welcome");
}

// ===== Event Listeners =====
els.startBtn.addEventListener("click", () => {
  userName = els.userNameInput.value.trim();
  currentQuestionIndex = 0;
  answers = [];
  showQuestion();
});

els.yesBtn.addEventListener("click", () => handleAnswer(true));
els.noBtn.addEventListener("click", () => handleAnswer(false));

els.yesWhatsAppBtn.addEventListener("click", () => {
  openWhatsApp();
});

els.noWhatsAppBtn.addEventListener("click", () => {
  showScreen("later");
});

els.backToConfirmBtn.addEventListener("click", () => {
  showScreen("confirmation");
});

els.restartFromLaterBtn.addEventListener("click", restart);
els.restartFromNoBtn.addEventListener("click", restart);

els.openWhatsAppAgainBtn.addEventListener("click", () => {
  openWhatsApp();
});

els.backFromOpenedBtn.addEventListener("click", () => {
  showScreen("confirmation");
});

// ===== Init =====
createFloatingHearts();
showScreen("welcome");
