// ============================================
// TEST-AI.JS - GROQ API (TEZ) ORQALI TEST YARATISH
// ============================================

// Groq API kalitlari (sizda bor)
const GROQ_API_KEYS = [
    "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",
    "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",
    "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",
    "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"
];
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

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

// Qiyinlik koeffitsientlari (GLOBAL)
window.QIYINLIK_KOEFF = {
  "5": 1.0, "6a": 1.2, "6b": 1.2, "7a": 1.5, "7b": 1.5,
  "8a": 1.8, "8b": 1.8, "9a": 2.0, "9b": 2.0, "10a": 2.2
};

// Har bir sinf+fan uchun mavzular
const MAVZULAR = {
  "5_matematika": ["Sonlar", "Qo'shish", "Ayirish", "Ko'paytirish", "Bo'lish"],
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
// GROQ API ORQALI TEST YARATISH
// ============================================

async function callGroqAPI(messages) {
  for (const key of GROQ_API_KEYS) {
    try {
      const response = await fetch(GROQ_API_URL, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${key}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: messages,
          temperature: 0.7,
          max_tokens: 4096
        })
      });
      
      if (response.status === 200) {
        const data = await response.json();
        return data.choices[0].message.content;
      }
    } catch(e) {
      console.warn("Groq API xatosi, keyingi kalit sinab ko'riladi");
    }
  }
  throw new Error("Barcha Groq kalitlari ishlamadi");
}

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
- Har bir savol 4 variantli (A, B, C, D) bo'lsin

JAVOB FORMATI (faqat JSON qaytar, boshqa matn yo'q):
{
  "savollar": [
    {
      "savol": "Savol matni",
      "variantlar": ["A variant", "B variant", "C variant", "D variant"],
      "togri": 0,
      "ball": 2
    }
  ]
}

To'g'ri javob indeksi 0-3 oralig'ida (0=A, 1=B, 2=C, 3=D)`;

    try {
      const content = await callGroqAPI([
        { role: "system", content: "Siz o'zbek tilida test tuzuvchi AIsiz. Faqat JSON formatda javob qaytaring." },
        { role: "user", content: prompt }
      ]);
      
      let cleanContent = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      const parsed = JSON.parse(cleanContent);
      
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
      if (i % 5 === 0) await this.sleep(500);
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
    const allTests = await new Promise(resolve => {
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => resolve([]);
    });
    return allTests.filter(t => t.sinf === sinf && t.fan === fan);
  }
  
  async getActiveTests(sinf, fan) {
    const allTests = await this.getAllTestsForSubject(sinf, fan);
    return allTests.filter(t => t.aktiv === true).slice(0, 20); // 20 ta faol test
  }
  
  async randomizeActiveTests(sinf, fan, activeCount = 20) {
    const allTests = await this.getAllTestsForSubject(sinf, fan);
    if (allTests.length === 0) return [];
    
    // Avval barcha testlarni faol emas qilish
    for (let test of allTests) {
      test.aktiv = false;
      if (typeof db !== 'undefined' && db.db) {
        const store = db.db.transaction("tests", "readwrite").objectStore("tests");
        await new Promise(resolve => {
          const req = store.put(test);
          req.onsuccess = () => resolve();
        });
      }
    }
    
    // Random 20 ta testni tanlash
    const shuffled = [...allTests];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    const selectedTests = shuffled.slice(0, activeCount);
    for (let test of selectedTests) {
      test.aktiv = true;
      if (typeof db !== 'undefined' && db.db) {
        const store = db.db.transaction("tests", "readwrite").objectStore("tests");
        await new Promise(resolve => {
          const req = store.put(test);
          req.onsuccess = () => resolve();
        });
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
    
    const prompt = `Siz 41-maktab o'quvchilari uchun KOMBINATSION TEST tuzuvchi AIsiz.
Sinf: ${sinf}
20 ta savol, har bir savol 4 variantli, har biri 2 ball.
Barcha fanlardan aralash savollar bo'lsin.

JAVOB FORMATI (faqat JSON):
{
  "savollar": [
    {"savol": "...", "variantlar": ["A","B","C","D"], "togri": 0, "ball": 2}
  ]
}`;

    try {
      const content = await callGroqAPI([
        { role: "system", content: "Siz o'zbek tilida test tuzuvchi AIsiz. Faqat JSON formatda javob qaytaring." },
        { role: "user", content: prompt }
      ]);
      
      let cleanContent = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      const parsed = JSON.parse(cleanContent);
      
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
    for (let i = 0; i < 20; i++) {
      questions.push({
        savol: `Kombinatsion test ${i+1}-savol`,
        variantlar: ["A variant", "B variant", "C variant", "D variant"],
        togri: 0,
        ball: 2
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

console.log("✅ AI Test Generator (Groq API) yuklandi");
console.log("📚 Sinf va fanlar:", SINFLAR.length, "sinf,", FANLAR.length, "fan");
console.log("🤖 API: Groq (Llama 3.1 8B) - TEZ");
