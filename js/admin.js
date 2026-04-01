// ============================================
// ADMIN.JS - ADMIN PANEL FUNKSIYALARI
// ============================================

const ADMIN_PASSWORD = "01170310";

let isAdminLoggedIn = false;

// Login tekshirish
function checkAdminLogin() {
  const password = document.getElementById('adminPassword').value;
  if (password === ADMIN_PASSWORD) {
    isAdminLoggedIn = true;
    document.getElementById('loginPage').style.display = 'none';
    document.getElementById('adminPanel').style.display = 'block';
    loadAdminStats();
    loadActiveTestsList();
  } else {
    alert('❌ Parol xato!');
  }
}

// Chiqish
function logout() {
  isAdminLoggedIn = false;
  document.getElementById('loginPage').style.display = 'flex';
  document.getElementById('adminPanel').style.display = 'none';
  document.getElementById('adminPassword').value = '';
}

// Statistika yuklash
async function loadAdminStats() {
  if (typeof db === 'undefined') return;
  await db.open();
  
  // O'quvchilar soni
  const oquvchilarStore = db.db.transaction("oquvchilar", "readonly").objectStore("oquvchilar");
  const oquvchilarCount = await new Promise(resolve => {
    const req = oquvchilarStore.count();
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => resolve(0);
  });
  
  // Testlar soni
  const testsStore = db.db.transaction("tests", "readonly").objectStore("tests");
  const testsCount = await new Promise(resolve => {
    const req = testsStore.count();
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => resolve(0);
  });
  
  // Natijalar soni
  const natijalarStore = db.db.transaction("natijalar", "readonly").objectStore("natijalar");
  const natijalarCount = await new Promise(resolve => {
    const req = natijalarStore.count();
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => resolve(0);
  });
  
  // Faol testlar soni
  const faolStore = db.db.transaction("faolTestlar", "readonly").objectStore("faolTestlar");
  const faolCount = await new Promise(resolve => {
    const req = faolStore.count();
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => resolve(0);
  });
  
  document.getElementById('statStudents').innerHTML = oquvchilarCount;
  document.getElementById('statTests').innerHTML = testsCount;
  document.getElementById('statResults').innerHTML = natijalarCount;
  document.getElementById('statActive').innerHTML = faolCount * 30;
}

// AI test yaratish
async function generateAITests() {
  const sinf = document.getElementById('aiSinf').value;
  const fan = document.getElementById('aiFan').value;
  const count = parseInt(document.getElementById('aiCount').value);
  
  const logDiv = document.getElementById('aiLog');
  const progressFill = document.getElementById('aiProgressFill');
  const progressText = document.getElementById('aiProgressText');
  
  logDiv.style.display = 'block';
  logDiv.innerHTML = '🚀 Test yaratish boshlandi...\n';
  progressFill.style.width = '0%';
  
  const fanInfo = FANLAR.find(f => f.nom === fan);
  
  let completed = 0;
  const tests = [];
  
  for (let i = 1; i <= count; i++) {
    progressText.innerHTML = `Test ${i}/${count} yaratilmoqda...`;
    progressFill.style.width = `${(i / count) * 100}%`;
    logDiv.innerHTML += `📝 Test ${i} yaratilmoqda...\n`;
    logDiv.scrollTop = logDiv.scrollHeight;
    
    const test = await aiTestGenerator.createSingleTest(sinf, fan, i);
    tests.push(test);
    
    try {
      await db.addTest(test);
      logDiv.innerHTML += `✅ Test ${i} saqlandi\n`;
    } catch (err) {
      logDiv.innerHTML += `❌ Test ${i} saqlashda xatolik: ${err.message}\n`;
    }
    
    completed = i;
    logDiv.scrollTop = logDiv.scrollHeight;
  }
  
  progressText.innerHTML = `✅ ${count} ta test yaratildi!`;
  progressFill.style.width = '100%';
  logDiv.innerHTML += `\n🎉 Barcha ${count} ta test yaratildi va saqlandi!\n`;
  
  // Statistikani yangilash
  loadAdminStats();
  loadActiveTestsList();
}

// Kombinatsion test yaratish
async function generateKombinatsionTests() {
  const sinflar = ["5", "6a", "6b", "7a", "7b", "8a", "8b", "9a", "9b", "10a"];
  const progressFill = document.getElementById('kombProgressFill');
  const progressText = document.getElementById('kombProgressText');
  
  progressFill.style.width = '0%';
  
  for (let i = 0; i < sinflar.length; i++) {
    const sinf = sinflar[i];
    progressText.innerHTML = `${sinf}-sinf kombinatsion test yaratilmoqda...`;
    progressFill.style.width = `${((i + 1) / sinflar.length) * 100}%`;
    
    const test = await kombinatsionGenerator.createKombinatsionTest(sinf);
    try {
      await db.addTest(test);
    } catch (err) {
      console.error("Xatolik:", err);
    }
  }
  
  progressText.innerHTML = `✅ Barcha kombinatsion testlar yaratildi!`;
  loadAdminStats();
}

// Faol testlarni random tanlash
async function randomizeActiveTests() {
  const sinf = document.getElementById('activeSinf').value;
  const fan = document.getElementById('activeFan').value;
  
  const allTests = await aiTestGenerator.getAllTestsForSubject(sinf, fan);
  if (allTests.length === 0) {
    alert(`⚠️ ${sinf} - ${fan} uchun testlar topilmadi. Avval test yarating!`);
    return;
  }
  
  // Random 30 ta test tanlash
  const shuffled = [...allTests];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  
  const selectedTests = shuffled.slice(0, 30);
  
  // Avvalgi aktiv testlarni o'chirish
  for (let test of allTests) {
    test.aktiv = false;
    await db.addTest(test);
  }
  
  // Yangi aktiv testlarni belgilash
  for (let test of selectedTests) {
    test.aktiv = true;
    await db.addTest(test);
  }
  
  alert(`✅ ${sinf} - ${fan} uchun 30 ta test random tanlandi!`);
  loadActiveTestsList();
}

// Faol testlar ro'yxatini ko'rsatish
async function loadActiveTestsList() {
  const sinf = document.getElementById('activeSinf').value;
  const fan = document.getElementById('activeFan').value;
  
  const container = document.getElementById('activeTestsList');
  const allTests = await aiTestGenerator.getAllTestsForSubject(sinf, fan);
  
  if (allTests.length === 0) {
    container.innerHTML = '<p class="text-muted">Testlar topilmadi. Avval test yarating!</p>';
    return;
  }
  
  let html = '';
  for (let test of allTests) {
    const isActive = test.aktiv === true;
    html += `
      <div class="test-item ${isActive ? 'active' : ''}">
        <span>${test.nom}</span>
        <button class="toggle-active" onclick="toggleTestActive('${test.id}', ${!isActive})">
          ${isActive ? '✅ Faol' : '⬜ Faol emas'}
        </button>
      </div>
    `;
  }
  
  container.innerHTML = html;
}

// Test aktivligini o'zgartirish
async function toggleTestActive(testId, aktiv) {
  const store = db.db.transaction("tests", "readwrite").objectStore("tests");
  const test = await new Promise(resolve => {
    const req = store.get(testId);
    req.onsuccess = () => resolve(req.result);
  });
  
  if (test) {
    test.aktiv = aktiv;
    await new Promise(resolve => {
      const req = store.put(test);
      req.onsuccess = () => resolve();
    });
    loadActiveTestsList();
  }
}

// Barcha ma'lumotlarni tozalash
async function clearAllData() {
  if (!confirm('⚠️ BARCHA MA\'LUMOTLAR O\'CHIRILADI! Davom etasizmi?')) return;
  
  const stores = ["tests", "natijalar", "oquvchilar", "faolTestlar"];
  for (let storeName of stores) {
    const store = db.db.transaction(storeName, "readwrite").objectStore(storeName);
    await new Promise(resolve => {
      const req = store.clear();
      req.onsuccess = () => resolve();
    });
  }
  
  alert('✅ Barcha ma\'lumotlar tozalandi!');
  loadAdminStats();
  loadActiveTestsList();
}

// Ma'lumotlarni eksport qilish
async function exportData() {
  const data = {
    tests: [],
    natijalar: [],
    oquvchilar: [],
    faolTestlar: []
  };
  
  const stores = ["tests", "natijalar", "oquvchilar", "faolTestlar"];
  for (let storeName of stores) {
    const store = db.db.transaction(storeName, "readonly").objectStore(storeName);
    const items = await new Promise(resolve => {
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result);
    });
    data[storeName] = items;
  }
  
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `maktab41_backup_${new Date().toISOString().slice(0,19)}.json`;
  a.click();
  URL.revokeObjectURL(url);
  alert('✅ Ma\'lumotlar eksport qilindi!');
}

// Ma'lumotlarni import qilish
async function importData(input) {
  const file = input.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = async function(e) {
    const data = JSON.parse(e.target.result);
    
    for (let storeName of ["tests", "natijalar", "oquvchilar", "faolTestlar"]) {
      if (data[storeName]) {
        const store = db.db.transaction(storeName, "readwrite").objectStore(storeName);
        await store.clear();
        for (let item of data[storeName]) {
          await new Promise(resolve => {
            const req = store.add(item);
            req.onsuccess = () => resolve();
          });
        }
      }
    }
    
    alert('✅ Ma\'lumotlar import qilindi!');
    loadAdminStats();
    loadActiveTestsList();
  };
  reader.readAsText(file);
}

// Sahifa yuklanganda
document.addEventListener('DOMContentLoaded', async function() {
  if (typeof db !== 'undefined') {
    await db.open();
  }
});

// Yashirin admin panelga o'tish (logoga 5 marta bosish)
let adminClickCount = 0;
let adminTimer = null;

document.addEventListener('click', function(e) {
  const logo = document.querySelector('.logo img, .logo');
  if (logo && logo.contains(e.target)) {
    adminClickCount++;
    if (adminTimer) clearTimeout(adminTimer);
    adminTimer = setTimeout(() => { adminClickCount = 0; }, 1000);
    
    if (adminClickCount >= 5) {
      window.location.href = 'admin.html';
    }
  }
});

console.log("✅ Admin panel yuklandi");
