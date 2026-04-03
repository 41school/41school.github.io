// ============================================
// ADMIN.JS - ADMIN PANEL FUNKSIYALARI
// ============================================

const ADMIN_PASSWORD = "01170310";
const ACTIVE_TESTS_COUNT = 20; // 30 emas, 20 ta!

let isAdminLoggedIn = false;

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

function logout() {
  isAdminLoggedIn = false;
  document.getElementById('loginPage').style.display = 'flex';
  document.getElementById('adminPanel').style.display = 'none';
  document.getElementById('adminPassword').value = '';
}

async function loadAdminStats() {
  if (typeof db === 'undefined') return;
  await db.open();
  
  const oquvchilarStore = db.db.transaction("oquvchilar", "readonly").objectStore("oquvchilar");
  const oquvchilarCount = await new Promise(resolve => {
    const req = oquvchilarStore.count();
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => resolve(0);
  });
  
  const testsStore = db.db.transaction("tests", "readonly").objectStore("tests");
  const testsCount = await new Promise(resolve => {
    const req = testsStore.count();
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => resolve(0);
  });
  
  const natijalarStore = db.db.transaction("natijalar", "readonly").objectStore("natijalar");
  const natijalarCount = await new Promise(resolve => {
    const req = natijalarStore.count();
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => resolve(0);
  });
  
  document.getElementById('statStudents').innerHTML = oquvchilarCount;
  document.getElementById('statTests').innerHTML = testsCount;
  document.getElementById('statResults').innerHTML = natijalarCount;
}

async function generateAITests() {
  const sinf = document.getElementById('aiSinf').value;
  const fan = document.getElementById('aiFan').value;
  const count = parseInt(document.getElementById('aiCount').value);
  
  const logDiv = document.getElementById('aiLog');
  const progressFill = document.getElementById('aiProgressFill');
  const progressText = document.getElementById('aiProgressText');
  
  logDiv.style.display = 'block';
  logDiv.innerHTML = '🚀 Test yaratish boshlandi (Groq API - tez)...\n';
  progressFill.style.width = '0%';
  
  for (let i = 1; i <= count; i++) {
    progressText.innerHTML = `Test ${i}/${count} yaratilmoqda...`;
    progressFill.style.width = `${(i / count) * 100}%`;
    logDiv.innerHTML += `📝 Test ${i} yaratilmoqda...\n`;
    logDiv.scrollTop = logDiv.scrollHeight;
    
    const test = await aiTestGenerator.createSingleTest(sinf, fan, i);
    
    try {
      await db.addTest(test);
      logDiv.innerHTML += `✅ Test ${i} saqlandi\n`;
    } catch (err) {
      logDiv.innerHTML += `❌ Test ${i} saqlashda xatolik: ${err.message}\n`;
    }
    
    logDiv.scrollTop = logDiv.scrollHeight;
  }
  
  progressText.innerHTML = `✅ ${count} ta test yaratildi!`;
  progressFill.style.width = '100%';
  logDiv.innerHTML += `\n🎉 Barcha ${count} ta test yaratildi va saqlandi!\n`;
  
  loadAdminStats();
  loadActiveTestsList();
}

async function randomizeActiveTests() {
  const sinf = document.getElementById('activeSinf').value;
  const fan = document.getElementById('activeFan').value;
  
  const allTests = await aiTestGenerator.getAllTestsForSubject(sinf, fan);
  if (allTests.length === 0) {
    alert(`⚠️ ${sinf} - ${fan} uchun testlar topilmadi. Avval test yarating!`);
    return;
  }
  
  // 20 ta random testni faol qilish
  const selectedTests = await aiTestGenerator.randomizeActiveTests(sinf, fan, ACTIVE_TESTS_COUNT);
  
  alert(`✅ ${sinf} - ${fan} uchun ${selectedTests.length} ta test random tanlandi va faollashtirildi!`);
  loadActiveTestsList();
}

async function loadActiveTestsList() {
  const sinf = document.getElementById('activeSinf').value;
  const fan = document.getElementById('activeFan').value;
  
  const container = document.getElementById('activeTestsList');
  const allTests = await aiTestGenerator.getAllTestsForSubject(sinf, fan);
  
  if (allTests.length === 0) {
    container.innerHTML = '<p class="text-muted">Testlar topilmadi. Avval test yarating!</p>';
    return;
  }
  
  // Faol testlarni hisoblash
  const activeTests = allTests.filter(t => t.aktiv === true);
  
  let html = `<p><strong>📊 Faol testlar: ${activeTests.length} / ${ACTIVE_TESTS_COUNT}</strong></p>`;
  
  for (let test of allTests.slice(0, 50)) { // 50 ta testni ko'rsatish
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

async function clearAllData() {
  if (!confirm('⚠️ BARCHA MA\'LUMOTLAR O\'CHIRILADI! Davom etasizmi?')) return;
  
  const stores = ["tests", "natijalar", "oquvchilar"];
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

async function exportData() {
  const data = { tests: [], natijalar: [], oquvchilar: [] };
  
  const stores = ["tests", "natijalar", "oquvchilar"];
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

async function importData(input) {
  const file = input.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = async function(e) {
    const data = JSON.parse(e.target.result);
    
    for (let storeName of ["tests", "natijalar", "oquvchilar"]) {
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

document.addEventListener('DOMContentLoaded', async function() {
  if (typeof db !== 'undefined') {
    await db.open();
  }
});

console.log("✅ Admin panel yuklandi");
console.log("📊 Faol testlar soni:", ACTIVE_TESTS_COUNT);
