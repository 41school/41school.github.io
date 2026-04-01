// ============================================
// TEST-NEW.JS - 20 SAVOL, 35 DAKIKA, QIYINLIK KOEFFITSIENTI
// ============================================

// QIYINLIK_KOEFF test-ai.js da bor, shuning uchun qayta e'lon qilmaymiz
// Agar test-ai.js yuklanmagan bo'lsa, ishlatish uchun tekshirish
if (typeof QIYINLIK_KOEFF === 'undefined') {
  var QIYINLIK_KOEFF = {
    "5": 1.0,
    "6a": 1.2,
    "6b": 1.2,
    "7a": 1.5,
    "7b": 1.5,
    "8a": 1.8,
    "8b": 1.8,
    "9a": 2.0,
    "9b": 2.0,
    "10a": 2.2
  };
}

// Global o'zgaruvchilar
let currentClass = null;
let currentSubject = null;
let currentTest = null;
let currentQuestionIndex = 0;
let userAnswers = [];
let timer = null;
let timeLeft = 0;
let startTime = null;
let isTestActive = false;

// Sinf nomlarini olish
function getClassName(classNum) {
  const classNames = {
    "5": "5-sinf",
    "6a": "6-A sinf",
    "6b": "6-B sinf",
    "7a": "7-A sinf",
    "7b": "7-B sinf",
    "8a": "8-A sinf",
    "8b": "8-B sinf",
    "9a": "9-A sinf",
    "9b": "9-B sinf",
    "10a": "10-A sinf"
  };
  return classNames[classNum] || classNum;
}

// Fan nomlarini olish
function getFanName(fan) {
  const fanNames = {
    "matematika": "🔢 Matematika",
    "ona-tili": "📖 Ona tili",
    "rus-tili": "🇷🇺 Rus tili",
    "fizika": "⚛️ Fizika",
    "kimyo": "🧪 Kimyo",
    "biologiya": "🧬 Biologiya",
    "tarix": "📜 Tarix",
    "geografiya": "🌍 Geografiya",
    "informatika": "💻 Informatika",
    "tabiiy-fan": "🌿 Tabiiy fan",
    "kombinatsion": "🎯 Kombinatsion test"
  };
  return fanNames[fan] || fan;
}

// Sinf tanlash
async function selectTestClass(classNum) {
  currentClass = classNum;
  
  // Tugmalarni yangilash
  document.querySelectorAll('.class-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  const activeBtn = document.querySelector(`.class-btn[data-class="${classNum}"]`);
  if (activeBtn) activeBtn.classList.add('active');
  
  // Fanlarni yuklash
  await loadSubjects(classNum);
}

// Fanlarni yuklash
async function loadSubjects(classNum) {
  const subjectsGrid = document.getElementById('subjects-grid');
  if (!subjectsGrid) {
    console.error("subjects-grid elementi topilmadi!");
    return;
  }
  
  subjectsGrid.innerHTML = '<div class="loading"><div class="loading-spinner"></div><p>Testlar yuklanmoqda...</p></div>';
  
  // Bazani ochish
  if (typeof db !== 'undefined' && db.db === null) {
    await db.open();
  }
  
  // Qaysi fanlar mavjud?
  const fanlar = [];
  
  // Fanlar ro'yxati (sinfga mos)
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
  
  // 5-sinf uchun faqat 5 ta fan
  if (classNum === "5") {
    const allowedFans = ["matematika", "ona-tili", "rus-tili", "tabiiy-fan", "tarix"];
    for (const fan of allFans) {
      if (allowedFans.includes(fan.nom)) {
        fanlar.push({ ...fan, testlarSoni: 30 }); // default 30 test
      }
    }
  } 
  // 6-sinf uchun geografiya qo'shiladi
  else if (classNum === "6a" || classNum === "6b") {
    const allowedFans = ["matematika", "ona-tili", "rus-tili", "tabiiy-fan", "tarix", "geografiya"];
    for (const fan of allFans) {
      if (allowedFans.includes(fan.nom)) {
        fanlar.push({ ...fan, testlarSoni: 30 });
      }
    }
  }
  // 7+ sinflar uchun hamma fanlar
  else {
    for (const fan of allFans) {
      fanlar.push({ ...fan, testlarSoni: 30 });
    }
  }
  
  // Kombinatsion testni qo'shish
  fanlar.push({
    nom: "kombinatsion",
    ozbekcha: "Kombinatsion test",
    icon: "🎯",
    testlarSoni: 1,
    isKombinatsion: true
  });
  
  // Fan kartochkalarini yaratish
  let html = '';
  for (const fan of fanlar) {
    const qiyinlikKoeff = QIYINLIK_KOEFF[classNum] || 1.0;
    const maxBall = 40; // 20 savol × 2 ball
    const umumiyBall = Math.floor(maxBall * qiyinlikKoeff);
    
    html += `
      <div class="subject-card ${fan.isKombinatsion ? 'kombinatsion' : ''}" onclick="selectSubject('${fan.nom}')">
        <div class="subject-icon">${fan.icon}</div>
        <h3>${fan.ozbekcha}</h3>
        <p>${getClassName(classNum)} uchun ${fan.testlarSoni} ta test mavjud</p>
        <div class="subject-info">
          <span class="questions">🎯 20 savol</span>
          <span class="time">⏱️ 35 daqiqa</span>
          <span class="ball">🏆 ${maxBall} ball</span>
        </div>
        <div class="test-stats">
          <span class="ball">✨ Qiyinlik: ${qiyinlikKoeff}x</span>
          <span class="time">💯 Maks: ${umumiyBall} ball</span>
        </div>
      </div>
    `;
  }
  
  subjectsGrid.innerHTML = html;
}

// Fanni tanlash
async function selectSubject(subjectId) {
  currentSubject = subjectId;
  
  // O'quvchi ma'lumotlarini tekshirish (localStorage dan)
  const savedStudent = localStorage.getItem(`student_${currentClass}_${currentSubject}`);
  if (savedStudent) {
    const student = JSON.parse(savedStudent);
    if (confirm(`${student.ism} ${student.familiya} sifatida davom etasizmi?`)) {
      const nameInput = document.getElementById('student-name');
      const surnameInput = document.getElementById('student-surname');
      if (nameInput) nameInput.value = student.ism;
      if (surnameInput) surnameInput.value = student.familiya;
    }
  }
  
  // Formani ko'rsatish
  const testSelection = document.getElementById('test-selection');
  const studentForm = document.getElementById('student-info-form');
  if (testSelection) testSelection.style.display = 'none';
  if (studentForm) studentForm.style.display = 'block';
}

// Orqaga qaytish
function backToSubjects() {
  const testSelection = document.getElementById('test-selection');
  const studentForm = document.getElementById('student-info-form');
  const studentFormElement = document.getElementById('student-form');
  
  if (studentForm) studentForm.style.display = 'none';
  if (testSelection) testSelection.style.display = 'block';
  if (studentFormElement) studentFormElement.reset();
}

// Student ma'lumotlarini yuborish
async function submitStudentInfo(event) {
  event.preventDefault();
  
  const ism = document.getElementById('student-name')?.value.trim();
  const familiya = document.getElementById('student-surname')?.value.trim();
  
  if (!ism || !familiya) {
    alert('Iltimos, ism va familiyangizni kiriting!');
    return;
  }
  
  // O'quvchini saqlash (agar db mavjud bo'lsa)
  const oquvchiId = `${ism.toLowerCase()}_${familiya.toLowerCase()}`;
  if (typeof db !== 'undefined' && db.db) {
    const oquvchi = {
      id: oquvchiId,
      ism: ism,
      familiya: familiya,
      sinf: currentClass,
      oxirgiKirish: new Date().toISOString()
    };
    await db.addOrUpdateOquvchi(oquvchi);
  }
  
  // LocalStorage ga saqlash (keyingi safar uchun)
  localStorage.setItem(`student_${currentClass}_${currentSubject}`, JSON.stringify({ ism, familiya }));
  
  // Testni boshlash
  await startTest(oquvchiId);
}

// Testni boshlash
async function startTest(oquvchiId) {
  // Testni tanlash
  let test = null;
  
  // Standart test yaratish (AI testlar hali tayyor bo'lmasa)
  const defaultTest = {
    id: `${currentClass}_${currentSubject}_001`,
    sinf: currentClass,
    fan: currentSubject,
    nom: `${getFanName(currentSubject)} testi`,
    savollar: generateDefaultQuestions(currentClass, currentSubject),
    qiyinlikKoeff: QIYINLIK_KOEFF[currentClass] || 1.0,
    vaqt: 35,
    aktiv: true,
    yaratilganVaqt: new Date().toISOString()
  };
  
  test = defaultTest;
  
  if (!test) {
    alert("Test topilmadi! Iltimos, keyinroq urinib ko'ring.");
    backToSubjects();
    return;
  }
  
  currentTest = test;
  currentQuestionIndex = 0;
  userAnswers = new Array(test.savollar.length).fill(undefined);
  
  // Vaqtni sozlash
  timeLeft = test.vaqt * 60;
  startTime = Date.now();
  
  // Test nomini o'rnatish
  const testTitle = document.getElementById('test-title');
  const testScore = document.getElementById('test-score');
  if (testTitle) testTitle.innerHTML = `${getFanName(currentSubject)} - ${getClassName(currentClass)}`;
  if (testScore) testScore.innerHTML = `🎯 0 ball`;
  
  // Taymerni boshlash
  startTimer();
  
  // Birinchi savolni ko'rsatish
  showQuestion();
  
  // Formani yashirish, testni ko'rsatish
  const studentForm = document.getElementById('student-info-form');
  const testContainer = document.getElementById('test-container');
  if (studentForm) studentForm.style.display = 'none';
  if (testContainer) testContainer.style.display = 'block';
  
  isTestActive = true;
}

// Standart savollar yaratish (AI testlar tayyor bo'lmaganda)
function generateDefaultQuestions(sinf, fan) {
  const questions = [];
  
  // Matematika uchun
  if (fan === "matematika") {
    const baseQuestions = [
      { savol: "5 + 3 = ?", variantlar: ["6", "7", "8", "9"], togri: 2, ball: 2 },
      { savol: "10 - 4 = ?", variantlar: ["4", "5", "6", "7"], togri: 2, ball: 2 },
      { savol: "3 × 4 = ?", variantlar: ["10", "11", "12", "13"], togri: 2, ball: 2 },
      { savol: "15 ÷ 3 = ?", variantlar: ["3", "4", "5", "6"], togri: 2, ball: 2 },
      { savol: "Qaysi son eng katta?", variantlar: ["12", "15", "9", "7"], togri: 1, ball: 2 }
    ];
    
    for (let i = 0; i < 20; i++) {
      const q = { ...baseQuestions[i % baseQuestions.length] };
      q.savol = `${q.savol} (${Math.floor(i/5)+1}-qism)`;
      questions.push(q);
    }
  }
  // Ona tili uchun
  else if (fan === "ona-tili") {
    const baseQuestions = [
      { savol: "Alifboda nechta harf bor?", variantlar: ["28", "29", "30", "31"], togri: 1, ball: 2 },
      { savol: "Unli harflar nechta?", variantlar: ["5", "6", "7", "8"], togri: 1, ball: 2 },
      { savol: "Gap qanday yoziladi?", variantlar: ["kichik", "katta", "qalin", "yog'on"], togri: 1, ball: 2 },
      { savol: '"Kitob" so\'zida nechta harf?', variantlar: ["4", "5", "6", "7"], togri: 1, ball: 2 },
      { savol: 'Nuqta qayerda qo\'yiladi?', variantlar: ["gap boshida", "gap oxirida", "o\'rtasida", "hech qayerda"], togri: 1, ball: 2 }
    ];
    
    for (let i = 0; i < 20; i++) {
      const q = { ...baseQuestions[i % baseQuestions.length] };
      q.savol = `${q.savol} (${Math.floor(i/5)+1}-qism)`;
      questions.push(q);
    }
  }
  // Rus tili uchun
  else if (fan === "rus-tili") {
    const baseQuestions = [
      { savol: "Сколько букв в русском алфавите?", variantlar: ["32", "33", "34", "35"], togri: 1, ball: 2 },
      { savol: "Как сказать 'Привет' по-узбекски?", variantlar: ["Salom", "Xayr", "Rahmat", "Kechirasiz"], togri: 0, ball: 2 },
      { savol: "Что означает 'Книга'?", variantlar: ["Daftar", "Qalam", "Kitob", "Ruchka"], togri: 2, ball: 2 }
    ];
    
    for (let i = 0; i < 20; i++) {
      const q = { ...baseQuestions[i % baseQuestions.length] };
      q.savol = `${q.savol} (${Math.floor(i/3)+1}-qism)`;
      questions.push(q);
    }
  }
  // Boshqa fanlar uchun
  else {
    for (let i = 0; i < 20; i++) {
      questions.push({
        savol: `${getFanName(fan)} fanidan ${i+1}-savol: Bu yerda test savoli bo'ladi`,
        variantlar: ["A variant", "B variant", "C variant", "D variant"],
        togri: 0,
        ball: 2
      });
    }
  }
  
  return questions;
}

// Taymer
function startTimer() {
  const timerElement = document.getElementById('timer');
  const testScore = document.getElementById('test-score');
  
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
    if (timerElement) timerElement.innerHTML = `⏱️ ${minutes}:${seconds.toString().padStart(2, '0')}`;
    
    // Joriy ballni hisoblash
    let currentScore = 0;
    for (let i = 0; i <= currentQuestionIndex; i++) {
      if (userAnswers[i] !== undefined && currentTest && currentTest.savollar[i]) {
        if (userAnswers[i] === currentTest.savollar[i].togri) {
          currentScore += 2;
        }
      }
    }
    if (testScore) testScore.innerHTML = `🎯 ${currentScore} ball`;
    
    timeLeft--;
  }, 1000);
}

// Savolni ko'rsatish
function showQuestion() {
  if (!currentTest || !currentTest.savollar) return;
  
  const question = currentTest.savollar[currentQuestionIndex];
  const container = document.getElementById('question-container');
  if (!container) return;
  
  let answersHtml = '';
  question.variantlar.forEach((answer, index) => {
    const isSelected = userAnswers[currentQuestionIndex] === index;
    answersHtml += `
      <div class="answer-option ${isSelected ? 'selected' : ''}" onclick="selectAnswer(${index})">
        <input type="radio" name="answer" id="answer-${index}" value="${index}" ${isSelected ? 'checked' : ''}>
        <label for="answer-${index}">${answer}</label>
      </div>
    `;
  });
  
  container.innerHTML = `
    <div class="question-card">
      <div class="question-number">Savol ${currentQuestionIndex + 1} / ${currentTest.savollar.length}</div>
      <div class="question-text">${question.savol}</div>
      <div class="answers-grid">
        ${answersHtml}
      </div>
    </div>
  `;
  
  // Progress barni yangilash
  updateProgress();
  updateNavigation();
}

// Javobni tanlash
function selectAnswer(answerIndex) {
  userAnswers[currentQuestionIndex] = answerIndex;
  
  // Eski tanlovni olib tashlash
  document.querySelectorAll('.answer-option').forEach(opt => {
    opt.classList.remove('selected');
  });
  
  // Yangi tanlovni belgilash
  const options = document.querySelectorAll('.answer-option');
  if (options[answerIndex]) {
    options[answerIndex].classList.add('selected');
    const radio = options[answerIndex].querySelector('input[type="radio"]');
    if (radio) radio.checked = true;
  }
}

// Progress barni yangilash
function updateProgress() {
  if (!currentTest) return;
  
  const progress = ((currentQuestionIndex + 1) / currentTest.savollar.length) * 100;
  const progressFill = document.getElementById('progress-fill');
  const progressText = document.getElementById('progress-text');
  
  if (progressFill) progressFill.style.width = `${progress}%`;
  if (progressText) progressText.innerHTML = `${currentQuestionIndex + 1}/${currentTest.savollar.length}`;
}

// Navigatsiyani yangilash
function updateNavigation() {
  if (!currentTest) return;
  
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  const finishBtn = document.getElementById('finish-btn');
  
  if (prevBtn) prevBtn.disabled = currentQuestionIndex === 0;
  
  if (currentQuestionIndex === currentTest.savollar.length - 1) {
    if (nextBtn) nextBtn.style.display = 'none';
    if (finishBtn) finishBtn.style.display = 'block';
  } else {
    if (nextBtn) nextBtn.style.display = 'block';
    if (finishBtn) finishBtn.style.display = 'none';
  }
}

// Oldingi savol
function previousQuestion() {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    showQuestion();
  }
}

// Keyingi savol
function nextQuestion() {
  if (currentTest && currentQuestionIndex < currentTest.savollar.length - 1) {
    currentQuestionIndex++;
    showQuestion();
  }
}

// Testni tugatish
function finishTest() {
  if (timer) clearInterval(timer);
  isTestActive = false;
  
  if (!currentTest) return;
  
  // Javoblarni tekshirish
  let correctCount = 0;
  currentTest.savollar.forEach((question, index) => {
    if (userAnswers[index] === question.togri) {
      correctCount++;
    }
  });
  
  const total = currentTest.savollar.length;
  const percentage = Math.round((correctCount / total) * 100);
  const timeTaken = Math.floor((Date.now() - startTime) / 1000);
  const minutes = Math.floor(timeTaken / 60);
  const seconds = timeTaken % 60;
  const timeString = `${minutes}:${seconds.toString().padStart(2, '0')}`;
  
  // Ball hisoblash
  const rawBall = correctCount * 2;
  const qiyinlikKoeff = QIYINLIK_KOEFF[currentClass] || 1.0;
  const totalBall = Math.floor(rawBall * qiyinlikKoeff);
  
  // Natijalarni ko'rsatish
  showResults(correctCount, total, percentage, timeString, rawBall, totalBall, qiyinlikKoeff);
}

// Natijalarni ko'rsatish
function showResults(correct, total, percentage, timeString, rawBall, totalBall, qiyinlikKoeff) {
  const scorePercentage = document.getElementById('score-percentage');
  const correctCount = document.getElementById('correct-count');
  const totalCount = document.getElementById('total-count');
  const timeTaken = document.getElementById('time-taken');
  const scorePoints = document.getElementById('score-points');
  const totalScore = document.getElementById('total-score');
  const qiyinlikSpan = document.getElementById('qiyinlik-koeff');
  
  if (scorePercentage) scorePercentage.innerHTML = `${percentage}%`;
  if (correctCount) correctCount.innerHTML = correct;
  if (totalCount) totalCount.innerHTML = total;
  if (timeTaken) timeTaken.innerHTML = timeString;
  if (scorePoints) scorePoints.innerHTML = rawBall;
  if (totalScore) totalScore.innerHTML = totalBall;
  if (qiyinlikSpan) qiyinlikSpan.innerHTML = `${qiyinlikKoeff}x`;
  
  // Progress barlar
  const correctBar = document.getElementById('correct-bar');
  const incorrectBar = document.getElementById('incorrect-bar');
  const correctPercent = document.getElementById('correct-percent');
  const incorrectPercent = document.getElementById('incorrect-percent');
  
  if (correctBar) correctBar.style.width = `${percentage}%`;
  if (incorrectBar) incorrectBar.style.width = `${100 - percentage}%`;
  if (correctPercent) correctPercent.innerHTML = `${percentage}%`;
  if (incorrectPercent) incorrectPercent.innerHTML = `${100 - percentage}%`;
  
  // Natija xabari
  const messageElement = document.getElementById('results-message');
  if (messageElement) {
    messageElement.className = 'results-message';
    
    if (percentage >= 90) {
      messageElement.className += ' excellent';
      messageElement.innerHTML = '🎉 Ajoyib! Sizning bilimingiz juda yaxshi!';
    } else if (percentage >= 70) {
      messageElement.className += ' good';
      messageElement.innerHTML = '👍 Yaxshi natija! Ozgina mashq qilsangiz yetarli';
    } else if (percentage >= 50) {
      messageElement.className += ' average';
      messageElement.innerHTML = '📚 Qoniqarli. Ko\'proq mashq qilishingiz kerak';
    } else {
      messageElement.className += ' poor';
      messageElement.innerHTML = '💪 Xafa bo\'lmang! Qayta urinib ko\'ring';
    }
  }
  
  // Testni yashirish, natijalarni ko'rsatish
  const testContainer = document.getElementById('test-container');
  const resultsContainer = document.getElementById('results-container');
  
  if (testContainer) testContainer.style.display = 'none';
  if (resultsContainer) resultsContainer.style.display = 'block';
}

// Testni qayta boshlash
function restartTest() {
  const resultsContainer = document.getElementById('results-container');
  if (resultsContainer) resultsContainer.style.display = 'none';
  
  const ism = document.getElementById('student-name')?.value;
  const familiya = document.getElementById('student-surname')?.value;
  const oquvchiId = `${ism?.toLowerCase()}_${familiya?.toLowerCase()}`;
  
  startTest(oquvchiId);
}

// Test tanlashga qaytish
function backToTestSelection() {
  if (timer) clearInterval(timer);
  
  const resultsContainer = document.getElementById('results-container');
  const testContainer = document.getElementById('test-container');
  const testSelection = document.getElementById('test-selection');
  
  if (resultsContainer) resultsContainer.style.display = 'none';
  if (testContainer) testContainer.style.display = 'none';
  if (testSelection) testSelection.style.display = 'block';
  
  currentSubject = null;
  currentTest = null;
  currentQuestionIndex = 0;
  userAnswers = [];
  isTestActive = false;
}

// Chiqish
function exitTest() {
  if (confirm('Testni tark etishga ishonchingiz komilmi? Javoblaringiz saqlanmaydi!')) {
    if (timer) clearInterval(timer);
    
    const testContainer = document.getElementById('test-container');
    const testSelection = document.getElementById('test-selection');
    
    if (testContainer) testContainer.style.display = 'none';
    if (testSelection) testSelection.style.display = 'block';
    
    currentSubject = null;
    currentTest = null;
    currentQuestionIndex = 0;
    userAnswers = [];
    isTestActive = false;
  }
}

// Batafsil natijalar
function showDetailedResults() {
  if (!currentTest) return;
  
  let details = '═══════════════════════════════\n';
  details += '     BATAFSIL NATIJALAR\n';
  details += '═══════════════════════════════\n\n';
  
  currentTest.savollar.forEach((question, index) => {
    const userAnswer = userAnswers[index];
    const isCorrect = userAnswer === question.togri;
    
    details += `📌 Savol ${index + 1}: ${question.savol}\n`;
    details += `   Sizning javobingiz: ${userAnswer !== undefined ? question.variantlar[userAnswer] : 'Javob berilmagan'}\n`;
    details += `   To'g'ri javob: ${question.variantlar[question.togri]}\n`;
    details += `   Natija: ${isCorrect ? '✅ TO\'G\'RI (+2 ball)' : '❌ XATO (0 ball)'}\n`;
    details += '───────────────────────────────────\n';
  });
  
  alert(details);
}

// Sahifa yuklanganda
document.addEventListener('DOMContentLoaded', async function() {
  // Bazani ochish
  if (typeof db !== 'undefined') {
    await db.open();
  }
  
  // Default 5-sinfni tanlash
  const defaultButton = document.querySelector('.class-btn[data-class="5"]');
  if (defaultButton) {
    defaultButton.classList.add('active');
  }
  
  await loadSubjects('5');
});

console.log("✅ Test tizimi yuklandi (20 savol, 35 daqiqa)");
