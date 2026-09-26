// ============================================
// 41-MAKTAB - ASOSIY JAVASCRIPT (main.js)
// Barcha sahifalar uchun umumiy funksiyalar
// ============================================

// ============================================
// DARS JADVALI MA'LUMOTLARI (to'g'ri imlo bilan)
// ============================================

const schedules = {
  5: [
    { day: "Dushanba", lessons: ["Kelajak soati", "Adabiyot", "Jismoniy tarbiya", "Ona tili", "Matematika"] },
    { day: "Seshanba", lessons: ["Tabiiy fan", "Tarixdan hikoyalar", "Informatika", "Tasviriy san'at", "Matematika", "Ingliz tili", "Fransuz tili"] },
    { day: "Chorshanba", lessons: ["Musiqa", "Matematika", "Ona tili", "Fransuz tili", "Ingliz tili"] },
    { day: "Payshanba", lessons: ["Tarixdan hikoyalar", "Ona tili", "Adabiyot", "Texnologiya", "Texnologiya", "Fransuz tili", "Ingliz tili"] },
    { day: "Juma", lessons: ["Jismoniy tarbiya", "Ona tili", "Tabiiy fan", "Rus tili", "Matematika"] },
    { day: "Shanba", lessons: ["Rus tili", "Fransuz tili", "Ingliz tili", "Matematika", "Tarbiya"] }
  ],
  '6a': [
    { day: "Dushanba", lessons: ["Kelajak soati", "Fransuz tili", "Matematika", "Tabiiy fan", "Ona tili", "Fransuz tili"] },
    { day: "Seshanba", lessons: ["Fransuz tili", "Musiqa", "Matematika", "Tabiiy fan", "Tasviriy san'at", "Tarix"] },
    { day: "Chorshanba", lessons: ["Ona tili", "Rus tili", "Adabiyot", "Matematika"] },
    { day: "Payshanba", lessons: ["Fransuz tili", "Texnologiya", "Texnologiya", "Rus tili", "Jismoniy tarbiya"] },
    { day: "Juma", lessons: ["Adabiyot", "Jismoniy tarbiya", "Ona tili", "Matematika", "Tabiiy fan"] },
    { day: "Shanba", lessons: ["Tarix", "Informatika", "Ona tili", "Matematika", "Tarbiya"] }
  ],
  '6b': [
    { day: "Dushanba", lessons: ["Kelajak soati", "Jismoniy tarbiya", "Ona tili", "Matematika", "Texnologiya", "Texnologiya"] },
    { day: "Seshanba", lessons: ["Tasviriy san'at", "Tarbiya", "Tabiiy fan", "Matematika", "Fransuz tili"] },
    { day: "Chorshanba", lessons: ["Fransuz tili", "Musiqa", "Rus tili", "Ona tili", "Matematika", "Adabiyot"] },
    { day: "Payshanba", lessons: ["Adabiyot", "Jismoniy tarbiya", "Fransuz tili", "Ona tili", "Tabiiy fan"] },
    { day: "Juma", lessons: ["Tabiiy fan", "Tarix", "Matematika", "Ona tili"] },
    { day: "Shanba", lessons: ["Fransuz tili", "Matematika", "Informatika", "Tarix", "Rus tili"] }
  ],
  '7a': [
    { day: "Dushanba", lessons: ["Kelajak soati", "Geografiya", "Jismoniy tarbiya", "Fransuz tili", "Matematika", "Fizika"] },
    { day: "Seshanba", lessons: ["Matematika", "Fizika", "Tasviriy san'at", "Kimyo", "Fransuz tili", "Matematika"] },
    { day: "Chorshanba", lessons: ["Matematika", "Informatika", "Musiqa", "Fransuz tili", "O'zbekiston tarixi", "Jismoniy tarbiya"] },
    { day: "Payshanba", lessons: ["Ona tili", "Biologiya", "Fransuz tili", "Adabiyot", "Kimyo", "Geografiya"] },
    { day: "Juma", lessons: ["O'zbekiston tarixi", "Rus tili", "Matematika", "Ona tili", "Texnologiya", "Texnologiya"] },
    { day: "Shanba", lessons: ["Adabiyot", "Tarbiya", "Jahon tarixi", "Ona tili", "Rus tili", "Biologiya"] }
  ],
  '7b': [
    { day: "Dushanba", lessons: ["Kelajak soati", "Informatika", "Fransuz tili", "Fizika", "Geografiya", "Matematika"] },
    { day: "Seshanba", lessons: ["Fransuz tili", "Tasviriy san'at", "O'zbekiston tarixi", "Texnologiya", "Texnologiya", "Matematika"] },
    { day: "Chorshanba", lessons: ["Matematika", "Jismoniy tarbiya", "Tarbiya", "O'zbekiston tarixi", "Musiqa", "Fransuz tili"] },
    { day: "Payshanba", lessons: ["Fransuz tili", "Kimyo", "Adabiyot", "Geografiya", "Ona tili", "Jismoniy tarbiya"] },
    { day: "Juma", lessons: ["Matematika", "Ona tili", "Rus tili", "Fizika", "Biologiya", "Jahon tarixi"] },
    { day: "Shanba", lessons: ["Matematika", "Adabiyot", "Biologiya", "Rus tili", "Ona tili", "Kimyo"] }
  ],
  '8a': [
    { day: "Dushanba", lessons: ["Kelajak soati", "Adabiyot", "Geografiya", "Jismoniy tarbiya", "Chizmachilik", "Ona tili"] },
    { day: "Seshanba", lessons: ["Texnologiya", "Jismoniy tarbiya", "O'zbekiston tarixi", "Fizika", "Biologiya", "Fransuz tili"] },
    { day: "Chorshanba", lessons: ["Fransuz tili", "Rus tili", "Huquq", "Algebra", "Ona tili", "Geometriya"] },
    { day: "Payshanba", lessons: ["Ona tili", "O'zbekiston tarixi", "Rus tili", "Kimyo", "Fransuz tili", "Jahon tarixi"] },
    { day: "Juma", lessons: ["Adabiyot", "Iqtisodiyot", "Biologiya", "Algebra", "Geometriya"] },
    { day: "Shanba", lessons: ["Tarbiya", "Kimyo", "Fizika", "Informatika", "Algebra"] }
  ],
  '8b': [
    { day: "Dushanba", lessons: ["Kelajak soati", "Chizmachilik", "Ona tili", "Algebra", "Jismoniy tarbiya", "Adabiyot"] },
    { day: "Seshanba", lessons: ["Algebra", "Informatika", "Biologiya", "Fransuz tili", "Fizika"] },
    { day: "Chorshanba", lessons: ["Tarbiya", "Jahon tarixi", "Rus tili", "Ona tili", "Fransuz tili", "Algebra"] },
    { day: "Payshanba", lessons: ["Geografiya", "Fransuz tili", "Rus tili", "Jismoniy tarbiya", "Ona tili", "Kimyo"] },
    { day: "Juma", lessons: ["Texnologiya", "Geografiya", "O'zbekiston tarixi", "Geometriya", "Adabiyot", "Fizika"] },
    { day: "Shanba", lessons: ["Geometriya", "Huquq", "Kimyo", "Biologiya", "O'zbekiston tarixi"] }
  ],
  '9a': [
    { day: "Dushanba", lessons: ["Kelajak soati", "Adabiyot", "Fransuz tili", "Chizmachilik", "Ona tili", "Informatika"] },
    { day: "Seshanba", lessons: ["O'zbekiston tarixi", "Geografiya", "Fizika", "Algebra", "Geometriya", "Jismoniy tarbiya"] },
    { day: "Chorshanba", lessons: ["Jismoniy tarbiya", "Geometriya", "Algebra", "Informatika", "Fransuz tili", "Tarbiya"] },
    { day: "Payshanba", lessons: ["Texnologiya", "Ona tili", "Kimyo", "Fransuz tili", "Jahon tarixi", "Adabiyot"] },
    { day: "Juma", lessons: ["Biologiya", "Fizika", "Ona tili", "Rus tili", "O'zbekiston tarixi", "Geografiya"] },
    { day: "Shanba", lessons: ["Biologiya", "Rus tili", "Huquq", "Algebra", "Kimyo"] }
  ],
  '9b': [
    { day: "Dushanba", lessons: ["Kelajak soati", "Algebra", "Chizmachilik", "Ona tili", "Adabiyot", "Kimyo"] },
    { day: "Seshanba", lessons: ["Fizika", "Geometriya", "Algebra", "Jismoniy tarbiya", "O'zbekiston tarixi", "Fransuz tili"] },
    { day: "Chorshanba", lessons: ["Informatika", "Adabiyot", "Fransuz tili", "Jismoniy tarbiya", "Geometriya", "Huquq"] },
    { day: "Payshanba", lessons: ["Kimyo", "Fransuz tili", "Geografiya", "Jahon tarixi", "Biologiya", "Rus tili"] },
    { day: "Juma", lessons: ["Ona tili", "Texnologiya", "Informatika", "O'zbekiston tarixi", "Tarbiya", "Iqtisodiyot"] },
    { day: "Shanba", lessons: ["Fizika", "Algebra", "Ona tili", "Rus tili", "Biologiya"] }
  ],
  '10a': [
    { day: "Dushanba", lessons: ["Kelajak soati", "Fizika", "Algebra", "Geometriya", "Informatika"] },
    { day: "Seshanba", lessons: ["Biologiya", "Fransuz tili", "Kimyo", "Huquq", "Geografiya"] },
    { day: "Chorshanba", lessons: ["Rus tili", "Fransuz tili", "ChYoT", "Jismoniy tarbiya", "Tarbiya", "Ona tili"] },
    { day: "Payshanba", lessons: ["Biologiya", "Geografiya", "O'zbekiston tarixi", "Adabiyot", "ChYoT"] },
    { day: "Juma", lessons: ["Ona tili", "Algebra", "Jahon tarixi", "Jismoniy tarbiya", "Adabiyot", "Rus tili"] }
  ]
};

// ============================================
// FAN RANGLARI KALITLARI (har bir fan — o'z rangi)
// ============================================

function getLessonKey(lesson) {
  const map = {
    'Matematika': 'matematika',
    'Algebra': 'matematika',
    'Geometriya': 'matematika',
    'Ona tili': 'ona-tili',
    'Adabiyot': 'adabiyot',
    'Ingliz tili': 'ingliz-tili',
    'Fransuz tili': 'fransuz-tili',
    'Rus tili': 'rus-tili',
    'Fizika': 'fizika',
    'Kimyo': 'kimyo',
    'Biologiya': 'biologiya',
    'Tarix': 'tarix',
    'Tarixdan hikoyalar': 'tarix',
    "O'zbekiston tarixi": 'tarix',
    'Jahon tarixi': 'tarix',
    'Geografiya': 'geografiya',
    'Informatika': 'informatika',
    'Texnologiya': 'texnologiya',
    'Chizmachilik': 'chizmachilik',
    'Jismoniy tarbiya': 'jismoniy-tarbiya',
    'Musiqa': 'musiqa',
    "Tasviriy san'at": 'sanat',
    'Tarbiya': 'tarbiya',
    'Huquq': 'huquq',
    'Iqtisodiyot': 'iqtisodiyot',
    'Kelajak soati': 'kelajak',
    'Tabiiy fan': 'tabiiy-fan',
    'ChYoT': 'chyot'
  };
  return map[lesson] || '';
}

// ============================================
// SINF TUGMALARI — MOBIL ACCORDION
// ============================================

function toggleClassButtons() {
  var btn = document.getElementById('mobileClassToggle');
  var list = document.getElementById('classButtons');
  if (!btn || !list) return;
  btn.classList.toggle('active');
  list.classList.toggle('active');
}

// ============================================
// DARS JADVALINI KO'RSATISH
// ============================================

let isFirstLoad = true;

function showSchedule(classType) {
  document.querySelectorAll('.class-btn').forEach(function(btn) { btn.classList.remove('active'); });
  var activeBtn = document.querySelector('.class-btn[data-class="' + classType + '"]');
  if (activeBtn) activeBtn.classList.add('active');

  // Mobil accordion — tanlangan sinfni ko'rsatish va yopish
  var currentClassLabel = document.getElementById('currentClass');
  if (currentClassLabel && activeBtn) {
    currentClassLabel.textContent = activeBtn.textContent;
  }
  var toggleBtn = document.getElementById('mobileClassToggle');
  var classBtns = document.getElementById('classButtons');
  if (toggleBtn) toggleBtn.classList.remove('active');
  if (classBtns) classBtns.classList.remove('active');

  var scheduleData = schedules[classType];
  var container = document.getElementById('schedule-container');
  if (!container) return;

  if (!scheduleData || scheduleData.length === 0) {
    container.innerHTML = '<div style="text-align:center;padding:60px;">' +
      '<h3 style="color:var(--gray-500);">📚 Bu sinf uchun jadval hozircha mavjud emas</h3></div>';
    return;
  }

  var maxLessons = 0;
  scheduleData.forEach(function(day) { if (day.lessons.length > maxLessons) maxLessons = day.lessons.length; });

  var headersHtml = '<th>Kun</th>';
  for (var i = 1; i <= maxLessons; i++) headersHtml += '<th>' + i + '-dars</th>';

  var rowsHtml = '';
  scheduleData.forEach(function(day) {
    rowsHtml += '<tr>';
    rowsHtml += '<td data-label="Kun">' + day.day + '</td>';
    for (var j = 0; j < maxLessons; j++) {
      var lesson = day.lessons[j] || '—';
      var lessonKey = getLessonKey(lesson);
      rowsHtml += '<td data-lesson="' + lessonKey + '" data-label="' + (j + 1) + '-dars">' + lesson + '</td>';
    }
    rowsHtml += '</tr>';
  });

  container.innerHTML = '<table class="schedule-table"><thead><tr>' + headersHtml +
    '</tr></thead><tbody>' + rowsHtml + '</tbody></table>';

  if (!isFirstLoad) {
    container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
  isFirstLoad = false;
}

// ============================================
// MOBIL MENYU
// ============================================

function initMobileMenu() {
  var btn = document.getElementById('mobileMenuBtn');
  var nav = document.getElementById('mainNav');
  var overlay = document.getElementById('navOverlay');
  if (!btn || !nav) return;

  function openMenu() {
    btn.classList.add('active');
    nav.classList.add('active');
    if (overlay) overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    btn.classList.remove('active');
    nav.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  btn.addEventListener('click', function() {
    if (nav.classList.contains('active')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  if (overlay) {
    overlay.addEventListener('click', closeMenu);
  }

  // Menyu havolasini bosganda menyuni yopish
  nav.querySelectorAll('a').forEach(function(link) {
    link.addEventListener('click', closeMenu);
  });
}

// ============================================
// SCROLL REVEAL ANIMATION
// ============================================

function initScrollReveal() {
  var els = document.querySelectorAll('.scroll-reveal');
  if (!els.length) return;

  function check() {
    els.forEach(function(el) {
      if (el.getBoundingClientRect().top < window.innerHeight * 0.85) {
        el.classList.add('visible');
      }
    });
  }

  window.addEventListener('scroll', check);
  window.addEventListener('load', check);
  check();
}

// ============================================
// DARK MODE FUNKSIYASI
// ============================================

function initDarkMode() {
  var toggleBtn = document.getElementById('dark-mode-toggle');
  if (!toggleBtn) return;

  function apply() {
    var isDark = localStorage.getItem('theme') === 'dark';
    document.body.classList.toggle('dark', isDark);
    toggleBtn.textContent = isDark ? '☀️' : '🌙';
  }

  apply();

  toggleBtn.addEventListener('click', function() {
    document.body.classList.toggle('dark');
    var isDark = document.body.classList.contains('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    toggleBtn.textContent = isDark ? '☀️' : '🌙';
  });
}

// ============================================
// SAHIFA YUKLANGANDA
// ============================================

document.addEventListener('DOMContentLoaded', function() {
  initDarkMode();
  initMobileMenu();
  initScrollReveal();

  var scheduleContainer = document.getElementById('schedule-container');
  if (scheduleContainer) {
    var defaultBtn = document.querySelector('.class-btn[data-class="5"]');
    if (defaultBtn) defaultBtn.classList.add('active');
    showSchedule('5');
  }
});