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
