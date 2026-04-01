// ============================================
// TEST.JS - 20 SAVOL, 35 DAKIKA
// ============================================

// QIYINLIK_KOEFF test-ai.js da e'lon qilingan, shuning uchun qayta e'lon qilmaymiz
// Faqat mavjudligini tekshiramiz
if (typeof window.QIYINLIK_KOEFF === 'undefined') {
  window.QIYINLIK_KOEFF = {
    "5": 1.0, "6a": 1.2, "6b": 1.2, "7a": 1.5, "7b": 1.5,
    "8a": 1.8, "8b": 1.8, "9a": 2.0, "9b": 2.0, "10a": 2.2
  };
}

// Qulaylik uchun o'zgaruvchi
const QIYINLIK_KOEFF = window.QIYINLIK_KOEFF;

let currentClass = "5";
let currentSubject = null;
let currentTest = null;
let currentQuestionIndex = 0;
let userAnswers = [];
let timer = null;
let timeLeft = 0;
let startTime = null;
let isTestActive = false;

function getClassName(classNum) {
  const names = { "5": "5-sinf", "6a": "6-A", "6b": "6-B", "7a": "7-A", "7b": "7-B",
    "8a": "8-A", "8b": "8-B", "9a": "9-A", "9b": "9-B", "10a": "10-A" };
  return names[classNum] || classNum;
}

function getFanName(fan) {
  const names = {
    "matematika": "🔢 Matematika", "ona-tili": "📖 Ona tili", "rus-tili": "🇷🇺 Rus tili",
    "fizika": "⚛️ Fizika", "kimyo": "🧪 Kimyo", "biologiya": "🧬 Biologiya",
    "tarix": "📜 Tarix", "geografiya": "🌍 Geografiya", "informatika": "💻 Informatika",
    "tabiiy-fan": "🌿 Tabiiy fan", "kombinatsion": "🎯 Kombinatsion test"
  };
  return names[fan] || fan;
}

// SINF TANLASH
window.selectTestClass = function(classNum) {
  currentClass = classNum;
  document.querySelectorAll('.class-btn').forEach(btn => btn.classList.remove('active'));
  const activeBtn = document.querySelector(`.class-btn[data-class="${classNum}"]`);
  if (activeBtn) activeBtn.classList.add('active');
  loadSubjects(classNum);
};

// FANLARNI YUKLASH (faqat kartochkalar, testlar yuklanmaydi)
async function loadSubjects(classNum) {
  const grid = document.getElementById('subjects-grid');
  if (!grid) return;
  
  // To'g'ridan-to'g'ri kartochkalarni ko'rsatish (yuklanayapti deb yozmaymiz)
  const allFans = [
    { nom: "matematika", ozbekcha: "Matematika", icon: "🔢" },
    { nom: "ona-tili", ozbekcha: "Ona tili", icon: "📖" },
    { nom: "rus-tili", ozbekcha: "Rus tili", icon: "🇷🇺" },
    { nom: "fizika", ozbekcha: "Fizika", icon: "⚛️" },
    { nom: "kimyo", ozbekcha: "Kimyo", icon: "🧪" },
    { nom: "biologiya", ozbekcha: "Biologiya", icon: "🧬" },
    { nom: "tarix", ozbekcha: "Tarix", icon: "📜" },
    { nom: "geografiya", ozbekcha: "Geografiya", icon: "🌍" },
    { nom: "informatika", ozbekcha: "Informatika", icon: "💻" },
    { nom: "tabiiy-fan", ozbekcha: "Tabiiy fan", icon: "🌿" }
  ];
  
  let allowedFans = [];
  if (classNum === "5") {
    allowedFans = ["matematika", "ona-tili", "rus-tili", "tabiiy-fan", "tarix"];
  } else if (classNum === "6a" || classNum === "6b") {
    allowedFans = ["matematika", "ona-tili", "rus-tili", "tabiiy-fan", "tarix", "geografiya"];
  } else {
    allowedFans = allFans.map(f => f.nom);
  }
  
  const fans = allFans.filter(f => allowedFans.includes(f.nom));
  fans.push({ nom: "kombinatsion", ozbekcha: "Kombinatsion test", icon: "🎯", isKombinatsion: true });
  
  let html = '';
  for (const fan of fans) {
    const koeff = QIYINLIK_KOEFF[classNum] || 1.0;
    html += `
      <div class="subject-card ${fan.isKombinatsion ? 'kombinatsion' : ''}" onclick="selectSubject('${fan.nom}')">
        <div class="subject-icon">${fan.icon}</div>
        <h3>${fan.ozbekcha}</h3>
        <p>${getClassName(classNum)} uchun testlar</p>
        <div class="subject-info">
          <span>🎯 20 savol</span>
          <span>⏱️ 35 daqiqa</span>
          <span>🏆 40 ball</span>
        </div>
        <div class="test-stats">
          <span>✨ Qiyinlik: ${koeff}x</span>
          <span>💯 Maks: ${Math.floor(40 * koeff)} ball</span>
        </div>
      </div>
    `;
  }
  grid.innerHTML = html;
}

// FAN TANLASH
window.selectSubject = function(subjectId) {
  currentSubject = subjectId;
  document.getElementById('test-selection').style.display = 'none';
  document.getElementById('student-info-form').style.display = 'block';
};

// ORQAGA
window.backToSubjects = function() {
  document.getElementById('student-info-form').style.display = 'none';
  document.getElementById('test-selection').style.display = 'block';
  document.getElementById('student-form').reset();
};

// TESTNI BOSHLASH
window.submitStudentInfo = function(event) {
  event.preventDefault();
  const ism = document.getElementById('student-name')?.value.trim();
  const familiya = document.getElementById('student-surname')?.value.trim();
  if (!ism || !familiya) {
    alert('Iltimos, ism va familiyangizni kiriting!');
    return;
  }
  localStorage.setItem(`student_${currentClass}_${currentSubject}`, JSON.stringify({ ism, familiya }));
  startTest();
};

function startTest() {
  const koeff = QIYINLIK_KOEFF[currentClass] || 1.0;
  
  currentTest = {
    id: `${currentClass}_${currentSubject}_001`,
    nom: `${getFanName(currentSubject)} - ${getClassName(currentClass)}`,
    savollar: generateQuestions(currentSubject, currentClass),
    qiyinlikKoeff: koeff,
    vaqt: 35
  };
  
  currentQuestionIndex = 0;
  userAnswers = new Array(currentTest.savollar.length).fill(undefined);
  timeLeft = currentTest.vaqt * 60;
  startTime = Date.now();
  isTestActive = true;
  
  document.getElementById('test-title').innerHTML = currentTest.nom;
  document.getElementById('test-score').innerHTML = '🎯 0 ball';
  
  startTimer();
  showQuestion();
  
  document.getElementById('student-info-form').style.display = 'none';
  document.getElementById('test-container').style.display = 'block';
}

function generateQuestions(fan, sinf) {
  const questions = [];
  const isEasy = sinf === "5";
  
  if (fan === "matematika") {
    for (let i = 0; i < 20; i++) {
      if (isEasy) {
        questions.push({
          savol: `${i+1}. 5 + ${i+3} = ?`,
          variantlar: [`${i+6}`, `${i+7}`, `${i+8}`, `${i+9}`],
          togri: 2,
          ball: 2
        });
      } else {
        questions.push({
          savol: `${i+1}. ${i+5} × ${i+2} = ?`,
          variantlar: [`${(i+5)*(i+2)-2}`, `${(i+5)*(i+2)-1}`, `${(i+5)*(i+2)}`, `${(i+5)*(i+2)+1}`],
          togri: 2,
          ball: 2
        });
      }
    }
  } 
  else if (fan === "ona-tili") {
    const base = [
      "Alifboda nechta harf bor?", "Unli harflar nechta?", "Gap qanday yoziladi?",
      '"Kitob" so\'zida nechta harf?', "Nuqta qayerda qo\'yiladi?"
    ];
    const answers = [["28","29","30","31"], ["5","6","7","8"], ["kichik","katta","qalin","yog'on"], ["4","5","6","7"], ["gap boshida","gap oxirida","o'rtasida","hech qayerda"]];
    const corrects = [1,1,1,1,1];
    for (let i = 0; i < 20; i++) {
      const idx = i % base.length;
      questions.push({
        savol: base[idx],
        variantlar: answers[idx],
        togri: corrects[idx],
        ball: 2
      });
    }
  }
  else if (fan === "rus-tili") {
    const base = [
      "Сколько букв в русском алфавите?", "Как сказать 'Привет' по-узбекски?",
      "Что означает 'Книга'?", "Как будет 'Дом' на узбекском?", "Как сказать 'Спасибо'?"
    ];
    const answers = [
      ["32","33","34","35"], ["Salom","Xayr","Rahmat","Kechirasiz"],
      ["Daftar","Qalam","Kitob","Ruchka"], ["Uy","Maktab","Bog'","Do'kon"],
      ["Rahmat","Salom","Xayr","Kechirasiz"]
    ];
    const corrects = [1,0,2,0,0];
    for (let i = 0; i < 20; i++) {
      const idx = i % base.length;
      questions.push({
        savol: base[idx],
        variantlar: answers[idx],
        togri: corrects[idx],
        ball: 2
      });
    }
  }
  else {
    for (let i = 0; i < 20; i++) {
      questions.push({
        savol: `${getFanName(fan)} fanidan ${i+1}-savol`,
        variantlar: ["A variant", "B variant", "C variant", "D variant"],
        togri: 0,
        ball: 2
      });
    }
  }
  
  return questions;
}

function startTimer() {
  if (timer) clearInterval(timer);
  timer = setInterval(() => {
    if (!isTestActive) return;
    if (timeLeft <= 0) {
      clearInterval(timer);
      finishTest();
      return;
    }
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    document.getElementById('timer').innerHTML = `⏱️ ${minutes}:${seconds.toString().padStart(2, '0')}`;
    
    let score = 0;
    for (let i = 0; i <= currentQuestionIndex; i++) {
      if (userAnswers[i] !== undefined && currentTest.savollar[i] && userAnswers[i] === currentTest.savollar[i].togri) {
        score += 2;
      }
    }
    document.getElementById('test-score').innerHTML = `🎯 ${score} ball`;
    timeLeft--;
  }, 1000);
}

function showQuestion() {
  const q = currentTest.savollar[currentQuestionIndex];
  const container = document.getElementById('question-container');
  
  let answersHtml = '';
  q.variantlar.forEach((ans, idx) => {
    const isSelected = userAnswers[currentQuestionIndex] === idx;
    answersHtml += `
      <div class="answer-option ${isSelected ? 'selected' : ''}" onclick="selectAnswer(${idx})">
        <input type="radio" name="answer" value="${idx}" ${isSelected ? 'checked' : ''}>
        <label>${ans}</label>
      </div>
    `;
  });
  
  container.innerHTML = `
    <div class="question-card">
      <div class="question-number">Savol ${currentQuestionIndex + 1} / ${currentTest.savollar.length}</div>
      <div class="question-text">${q.savol}</div>
      <div class="answers-grid">${answersHtml}</div>
    </div>
  `;
  
  const progress = ((currentQuestionIndex + 1) / currentTest.savollar.length) * 100;
  document.getElementById('progress-fill').style.width = `${progress}%`;
  document.getElementById('progress-text').innerHTML = `${currentQuestionIndex + 1}/${currentTest.savollar.length}`;
  
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  const finishBtn = document.getElementById('finish-btn');
  
  prevBtn.disabled = currentQuestionIndex === 0;
  
  if (currentQuestionIndex === currentTest.savollar.length - 1) {
    nextBtn.style.display = 'none';
    finishBtn.style.display = 'block';
  } else {
    nextBtn.style.display = 'block';
    finishBtn.style.display = 'none';
  }
}

window.selectAnswer = function(answerIndex) {
  userAnswers[currentQuestionIndex] = answerIndex;
  document.querySelectorAll('.answer-option').forEach(opt => opt.classList.remove('selected'));
  const options = document.querySelectorAll('.answer-option');
  if (options[answerIndex]) {
    options[answerIndex].classList.add('selected');
    const radio = options[answerIndex].querySelector('input[type="radio"]');
    if (radio) radio.checked = true;
  }
};

window.previousQuestion = function() {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    showQuestion();
  }
};

window.nextQuestion = function() {
  if (currentQuestionIndex < currentTest.savollar.length - 1) {
    currentQuestionIndex++;
    showQuestion();
  }
};

window.finishTest = function() {
  if (timer) clearInterval(timer);
  isTestActive = false;
  
  let correct = 0;
  currentTest.savollar.forEach((q, i) => {
    if (userAnswers[i] === q.togri) correct++;
  });
  
  const total = currentTest.savollar.length;
  const percentage = Math.round((correct / total) * 100);
  const timeTaken = Math.floor((Date.now() - startTime) / 1000);
  const minutes = Math.floor(timeTaken / 60);
  const seconds = timeTaken % 60;
  
  const rawBall = correct * 2;
  const totalBall = Math.floor(rawBall * currentTest.qiyinlikKoeff);
  
  document.getElementById('score-percentage').innerHTML = `${percentage}%`;
  document.getElementById('correct-count').innerHTML = correct;
  document.getElementById('total-count').innerHTML = total;
  document.getElementById('time-taken').innerHTML = `${minutes}:${seconds.toString().padStart(2, '0')}`;
  document.getElementById('score-points').innerHTML = rawBall;
  document.getElementById('total-score').innerHTML = totalBall;
  document.getElementById('qiyinlik-koeff').innerHTML = `${currentTest.qiyinlikKoeff}x`;
  
  document.getElementById('correct-bar').style.width = `${percentage}%`;
  document.getElementById('incorrect-bar').style.width = `${100 - percentage}%`;
  document.getElementById('correct-percent').innerHTML = `${percentage}%`;
  document.getElementById('incorrect-percent').innerHTML = `${100 - percentage}%`;
  
  const msgDiv = document.getElementById('results-message');
  if (percentage >= 90) msgDiv.innerHTML = '🎉 Ajoyib! Sizning bilimingiz juda yaxshi!';
  else if (percentage >= 70) msgDiv.innerHTML = '👍 Yaxshi natija! Ozgina mashq qilsangiz yetarli';
  else if (percentage >= 50) msgDiv.innerHTML = '📚 Qoniqarli. Ko\'proq mashq qilishingiz kerak';
  else msgDiv.innerHTML = '💪 Xafa bo\'lmang! Qayta urinib ko\'ring';
  
  document.getElementById('test-container').style.display = 'none';
  document.getElementById('results-container').style.display = 'block';
};

window.restartTest = function() {
  document.getElementById('results-container').style.display = 'none';
  startTest();
};

window.backToTestSelection = function() {
  if (timer) clearInterval(timer);
  document.getElementById('results-container').style.display = 'none';
  document.getElementById('test-container').style.display = 'none';
  document.getElementById('test-selection').style.display = 'block';
  currentSubject = null;
  currentTest = null;
  isTestActive = false;
};

window.exitTest = function() {
  if (confirm('Testni tark etishga ishonchingiz komilmi?')) {
    if (timer) clearInterval(timer);
    document.getElementById('test-container').style.display = 'none';
    document.getElementById('test-selection').style.display = 'block';
    currentSubject = null;
    currentTest = null;
    isTestActive = false;
  }
};

window.showDetailedResults = function() {
  if (!currentTest) return;
  let details = "BATAFSIL NATIJALAR\n\n";
  currentTest.savollar.forEach((q, i) => {
    const isCorrect = userAnswers[i] === q.togri;
    details += `${i+1}. ${q.savol}\n`;
    details += `   Javob: ${userAnswers[i] !== undefined ? q.variantlar[userAnswers[i]] : 'Berilmagan'}\n`;
    details += `   To'g'ri: ${q.variantlar[q.togri]}\n`;
    details += `   ${isCorrect ? '✅ TO\'G\'RI' : '❌ XATO'}\n\n`;
  });
  alert(details);
};

document.addEventListener('DOMContentLoaded', function() {
  console.log("Test sahifasi yuklandi");
  const btn = document.querySelector('.class-btn[data-class="5"]');
  if (btn) btn.classList.add('active');
  loadSubjects('5');
});

console.log("✅ Test tizimi yuklandi");
