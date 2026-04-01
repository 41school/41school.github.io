// ============================================
// TEST-AI.JS - AI ORQALI TEST YARATISH
// ============================================

// Mistral Large API kaliti
const MISTRAL_API_KEY = "vJtD1Lt8l60qRF7OSOWESe7wScLFFy4y";
const MISTRAL_API_URL = "https://api.mistral.ai/v1/chat/completions";

// Sinf va fanlar ro'yxati
const SINFLAR = ["5", "6a", "6b", "7a", "7b", "8a", "8b", "9a", "9b", "10a"];
const FANLAR = [
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

// Qiyinlik koeffitsientlari (GLOBAL - test.js da ham ishlatiladi)
window.QIYINLIK_KOEFF = {
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

// Har bir sinf+fan uchun o'tiladigan mavzular
const MAVZULAR = {
  "5_matematika": ["Sonlar", "Qo'shish", "Ayirish", "Ko'paytirish", "Bo'lish", "Kasrlar"],
  "5_ona-tili": ["Alifbo", "Harflar", "So'zlar", "Gap", "Tinish belgilari"],
  "5_rus-tili": ["Алфавит", "Буквы", "Слова", "Предложения"],
  "5_tabiiy-fan": ["Tirik organizmlar", "O'simliklar", "Hayvonlar", "Suv", "Havo"],
  "5_tarix": ["O'zbekiston tarixi", "Qadimgi odamlar", "Buyuk ipak yo'li"],
  "6_matematika": ["Natural sonlar", "Kasrlar", "Protsent", "Tenglama"],
  "6_ona-tili": ["So'z turkumlari", "Ot", "Sifat", "Fe'l"],
  "6_rus-tili": ["Существительное", "Прилагательное", "Глагол"],
  "6_tabiiy-fan": ["Suyuqliklar", "Gazlar", "Energiya", "Kuch"],
  "6_tarix": ["Qadimgi dunyo", "Yunoniston", "Rim"],
  "6_geografiya": ["Yer shari", "Materiklar", "Okeanlar"],
  "7_matematika": ["Algebraik ifodalar", "Tenglamalar", "Funksiya"],
  "7_fizika": ["Mexanik harakat", "Tezlik", "Kuch", "Bosim"],
  "7_kimyo": ["Atom", "Molekula", "Kimyoviy elementlar"],
  "7_biologiya": ["Hujayra", "To'qimalar", "Organlar"],
  "7_tarix": ["Shayboniylar", "Boburiylar", "Xiva xonligi"],
  "7_geografiya": ["O'zbekiston geografiyasi", "Farg'ona vodiysi", "Tog'lar"],
  "8_matematika": ["Kvadrat tenglamalar", "Progressiya", "Geometriya"],
  "8_fizika": ["Elektr toki", "Kuchlanish", "Om qonuni"],
  "8_kimyo": ["Kislotalar", "Asoslar", "Tuzlar"],
  "8_biologiya": ["Inson anatomiyasi", "Skelet", "Nerv sistemasi"],
  "8_tarix": ["Rossiya mustamlakasi", "Jadidchilik"],
  "8_geografiya": ["Dunyo geografiyasi", "Aholi", "Iqtisodiyot"],
  "8_informatika": ["Kompyuter tuzilishi", "Windows", "Internet"],
  "9_matematika": ["Trigonometriya", "Vektorlar", "Kombinatorika"],
  "9_fizika": ["Nyuton qonunlari", "Impuls", "Energiya"],
  "9_kimyo": ["Mendeleyev jadvali", "Kimyoviy bog'lanish", "Eritmalar"],
  "9_biologiya": ["Irsiyat", "Genetika", "Evolyutsiya"],
  "9_tarix": ["O'zbekiston XX asrda", "Mustaqillik"],
  "9_geografiya": ["Dunyo iqtisodiyoti", "Global muammolar"],
  "9_informatika": ["Algoritmlar", "Dasturlash", "Python"],
  "10_matematika": ["Hosila", "Integral", "Limit"],
  "10_fizika": ["Elektr maydoni", "Magnit maydoni", "Optika"],
  "10_kimyo": ["Organik kimyo", "Uglevodorodlar", "Spirtlar"],
  "10_biologiya": ["Hujayra biologiyasi", "Genetika", "Biotexnologiya"],
  "10_tarix": ["O'zbekiston mustaqillik yillarida", "Jahon tarixi"],
  "10_geografiya": ["Geosiyosat", "Xalqaro munosabatlar"],
  "10_informatika": ["Ma'lumotlar bazasi", "SQL", "JavaScript"]
};

// ============================================
// AI TEST GENERATOR CLASS
// ============================================

class AITestGenerator {
  
  async createSingleTest(sinf, fan, testNumber = 1) {
    const fanInfo = FANLAR.find(f => f.nom === fan);
    const fanNomi = fanInfo ? fanInfo.ozbekcha : fan;
    const qiyinlikKoeff = window.QIYINLIK_KOEFF[sinf] || 1.0;
    const sinfKey = sinf.replace(/[a-z]/g, '');
    const mavzular = MAVZULAR[`${sinfKey}_${fan}`] || MAVZULAR[`${sinf}_${fan}`] || ["Asosiy mavzular"];
    
    const prompt = `Siz 41-maktab o'quvchilari uchun test tuzuvchi AIsiz.

Test haqida:
- Sinf: ${sinf}
- Fan: ${fanNomi}
- 20 ta savol, har biri 2 ball
- Mavzular: ${mavzular.join(", ")}

JAVOB FORMATI (faqat JSON):
{
  "savollar": [
    {
      "savol": "Savol matni",
      "variantlar": ["A", "B", "C", "D"],
      "togri": 0,
      "ball": 2
    }
  ]
}`;

    try {
      const response = await fetch(MISTRAL_API_URL, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${MISTRAL_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "mistral-large-2411",
          messages: [
            { role: "system", content: "Siz o'zbek tilida test tuzuvchi AIsiz. Faqat JSON formatda javob qaytaring." },
            { role: "user", content: prompt }
          ],
          temperature: 0.7,
          max_tokens: 4096
        })
      });

      if (!response.ok) throw new Error(`API xatosi: ${response.status}`);
      const data = await response.json();
      let content = data.choices[0].message.content;
      content = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      const parsed = JSON.parse(content);
      
      return {
        id: `${sinf}_${fan}_${testNumber.toString().padStart(3, "0")}`,
        sinf: sinf,
        fan: fan,
        nom: `${fanNomi} testi #${testNumber}`,
        savollar: parsed.savollar,
        qiyinlikKoeff: qiyinlikKoeff,
        vaqt: 35,
        aktiv: false,
        yaratilganVaqt: new Date().toISOString()
      };
    } catch (error) {
      console.error("AI test yaratishda xatolik:", error);
      return this.createFallbackTest(sinf, fan, testNumber);
    }
  }
  
  async createMultipleTests(sinf, fan, count = 200, onProgress = null) {
    const tests = [];
    for (let i = 1; i <= count; i++) {
      if (onProgress) onProgress(i, count, `Test ${i}/${count} yaratilmoqda...`);
      const test = await this.createSingleTest(sinf, fan, i);
      tests.push(test);
      try {
        if (typeof db !== 'undefined' && db.db) await db.addTest(test);
      } catch (err) {}
      if (i % 10 === 0) await this.sleep(1000);
    }
    return tests;
  }
  
  createFallbackTest(sinf, fan, testNumber) {
    const fanInfo = FANLAR.find(f => f.nom === fan);
    const fanNomi = fanInfo ? fanInfo.ozbekcha : fan;
    const questions = [];
    for (let i = 0; i < 20; i++) {
      questions.push({
        savol: `${fanNomi} fanidan ${i+1}-savol`,
        variantlar: ["A variant", "B variant", "C variant", "D variant"],
        togri: 0,
        ball: 2
      });
    }
    return {
      id: `${sinf}_${fan}_${testNumber.toString().padStart(3, "0")}`,
      sinf: sinf,
      fan: fan,
      nom: `${fanNomi} testi #${testNumber}`,
      savollar: questions,
      qiyinlikKoeff: window.QIYINLIK_KOEFF[sinf] || 1.0,
      vaqt: 35,
      aktiv: false,
      yaratilganVaqt: new Date().toISOString()
    };
  }
  
  sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }
  
  async getAllTestsForSubject(sinf, fan) {
    if (typeof db === 'undefined' || !db.db) return [];
    const store = db.db.transaction("tests", "readonly").objectStore("tests");
    const index = store.index("sinf_fan");
    return new Promise((resolve) => {
      const request = index.getAll([sinf, fan]);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => resolve([]);
    });
  }
  
  async getActiveTests(sinf, fan) {
    const allTests = await this.getAllTestsForSubject(sinf, fan);
    return allTests.filter(t => t.aktiv === true).slice(0, 30);
  }
  
  async randomizeActiveTests(sinf, fan) {
    const allTests = await this.getAllTestsForSubject(sinf, fan);
    if (allTests.length === 0) return [];
    const shuffled = [...allTests];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    const selectedTests = shuffled.slice(0, 30);
    for (let test of selectedTests) {
      test.aktiv = true;
      if (typeof db !== 'undefined' && db.db) {
        const store = db.db.transaction("tests", "readwrite").objectStore("tests");
        store.put(test);
      }
    }
    return selectedTests;
  }
}

const aiTestGenerator = new AITestGenerator();

// ============================================
// KOMBINATSION TEST GENERATOR
// ============================================

class KombinatsionTestGenerator {
  
  async createKombinatsionTest(sinf, testNumber = 1) {
    const qiyinlikKoeff = window.QIYINLIK_KOEFF[sinf] || 1.0;
    const sinfKey = sinf.replace(/[a-z]/g, '');
    
    const fanlar = FANLAR.filter(f => {
      if (sinf === "5") return ["matematika", "ona-tili", "rus-tili", "tabiiy-fan", "tarix"].includes(f.nom);
      if (sinf === "6a" || sinf === "6b") return ["matematika", "ona-tili", "rus-tili", "tabiiy-fan", "tarix", "geografiya"].includes(f.nom);
      return true;
    });
    
    const prompt = `Siz 41-maktab o'quvchilari uchun KOMBINATSION TEST tuzuvchi AIsiz.
Sinf: ${sinf}
Fanlar: ${fanlar.map(f => f.ozbekcha).join(", ")}
20 ta savol, har bir fan dan 2-3 savol, har biri 2 ball.

JAVOB FORMATI (faqat JSON):
{
  "savollar": [
    {"savol": "...", "variantlar": ["A","B","C","D"], "togri": 0, "ball": 2, "fan": "matematika"}
  ]
}`;

    try {
      const response = await fetch(MISTRAL_API_URL, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${MISTRAL_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "mistral-large-2411",
          messages: [
            { role: "system", content: "Siz o'zbek tilida test tuzuvchi AIsiz. Faqat JSON formatda javob qaytaring." },
            { role: "user", content: prompt }
          ],
          temperature: 0.7,
          max_tokens: 4096
        })
      });
      
      if (!response.ok) throw new Error(`API xatosi: ${response.status}`);
      const data = await response.json();
      let content = data.choices[0].message.content;
      content = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      const parsed = JSON.parse(content);
      
      return {
        id: `kombinatsion_${sinf}_${testNumber.toString().padStart(3, "0")}`,
        sinf: sinf,
        fan: "kombinatsion",
        nom: `${sinf}-sinf uchun kombinatsion test`,
        savollar: parsed.savollar,
        qiyinlikKoeff: qiyinlikKoeff,
        vaqt: 35,
        aktiv: true,
        yaratilganVaqt: new Date().toISOString()
      };
    } catch (error) {
      console.error("Kombinatsion test xatosi:", error);
      return this.createFallbackKombinatsionTest(sinf);
    }
  }
  
  createFallbackKombinatsionTest(sinf) {
    const questions = [];
    const fanlar = ["Matematika", "Ona tili", "Rus tili", "Tarix", "Geografiya"];
    for (let i = 0; i < 20; i++) {
      const fan = fanlar[i % fanlar.length];
      questions.push({
        savol: `${fan} fanidan ${i+1}-savol`,
        variantlar: ["A variant", "B variant", "C variant", "D variant"],
        togri: 0,
        ball: 2,
        fan: fan.toLowerCase().replace(" ", "-")
      });
    }
    return {
      id: `kombinatsion_${sinf}_001`,
      sinf: sinf,
      fan: "kombinatsion",
      nom: `${sinf}-sinf uchun kombinatsion test`,
      savollar: questions,
      qiyinlikKoeff: window.QIYINLIK_KOEFF[sinf] || 1.0,
      vaqt: 35,
      aktiv: true,
      yaratilganVaqt: new Date().toISOString()
    };
  }
}

const kombinatsionGenerator = new KombinatsionTestGenerator();

// ============================================
// YORDAMCHI FUNKSIYALAR
// ============================================

async function generateAllTestsForSchool(onProgress) {
  const total = SINFLAR.length * FANLAR.length;
  let completed = 0;
  for (const sinf of SINFLAR) {
    for (const fan of FANLAR) {
      if (sinf === "5" && !["matematika", "ona-tili", "rus-tili", "tabiiy-fan", "tarix"].includes(fan.nom)) {
        completed++;
        continue;
      }
      if (onProgress) onProgress(completed, total, `${sinf} - ${fan.ozbekcha}`);
      const existingTests = await aiTestGenerator.getAllTestsForSubject(sinf, fan.nom);
      if (existingTests.length === 0) {
        await aiTestGenerator.createMultipleTests(sinf, fan.nom, 200);
      }
      completed++;
    }
  }
  return { success: true, message: "Barcha testlar yaratildi!" };
}

async function generateKombinatsionTestsForAllSinf(onProgress) {
  const sinflar = ["5", "6a", "6b", "7a", "7b", "8a", "8b", "9a", "9b", "10a"];
  for (let i = 0; i < sinflar.length; i++) {
    if (onProgress) onProgress(i + 1, sinflar.length, `${sinflar[i]}-sinf`);
    const test = await kombinatsionGenerator.createKombinatsionTest(sinflar[i]);
    if (typeof db !== 'undefined' && db.db) await db.addTest(test);
  }
  return { success: true, message: "Barcha kombinatsion testlar yaratildi!" };
}

console.log("✅ AI Test Generator yuklandi");
console.log("📚 Sinf va fanlar:", SINFLAR.length, "sinf,", FANLAR.length, "fan");
console.log("🤖 API: Mistral Large");
