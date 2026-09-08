/**
 * DIGISYNQ - Bilingual Localization Engine
 * English & Hindi instant switching with zero-flicker dom updating
 */

window.DigisynqI18n = (function () {
  'use strict';

  let currentLang = localStorage.getItem('digisynq_lang') || 'en';

  const translations = {
    en: {
      'nav_home': 'Home',
      'nav_about': 'About',
      'nav_platform': 'Platform',
      'nav_products': 'Products',
      'nav_nodes': 'Nodes',
      'nav_workshops': 'Workshops',
      'nav_guilds': 'Guilds',
      'nav_pricing': 'Pricing',
      'nav_join': 'JOIN THE PIPELINE',
      'hero_badge': 'THE NERVOUS SYSTEM OF INDIAN ENTERTAINMENT',
      'hero_title_1': 'THE ENTERTAINMENT INDUSTRY',
      'hero_title_2': 'HAS A WASTE PROBLEM.',
      'hero_title_3': 'WE ARE THE SOLUTION.',
      'hero_sub': 'Digisynq is the sync-first, asset-light pipeline that connects every node in Indian entertainment — activating idle talent, reviving dying projects, and ensuring that less potential is ever lost.',
      'btn_join_pipeline': 'JOIN THE PIPELINE',
      'btn_explore_platform': 'EXPLORE THE PLATFORM',
      'proof_text': 'Trusted by 500+ nodes across 20+ languages and 5+ verticals',
      'stat_loss_title': '₹500+ Cr',
      'stat_loss_desc': 'Lost annually in idle production capital',
      'stat_idle_title': '50,000+',
      'stat_idle_desc': 'Skilled professionals sitting idle between shoots',
      'stat_modules_title': '15 Modules',
      'stat_modules_desc': 'Engineered to systematically kill friction & waste',
      'stat_sync_title': '1 Network',
      'stat_sync_desc': 'To synchronize talent, assets, scripts & capital',
      'problem_tag': 'THE SYSTEMIC FAILURE',
      'problem_heading': 'SILOS ARE WASTE',
      'problem_sub': 'Indian cinema and digital entertainment suffer from massive fragmentation. When nodes do not communicate, money burns and creativity suffocates.',
      'solution_tag': 'THE ARCHITECTURE OF FLOW',
      'solution_heading': 'WE BUILD PIPES THROUGH WALLS',
      'solution_sub': 'The ABCDEF Pipeline transforms isolated creators and stalled productions into a seamless, high-velocity operating network.',
      'cta_tag': 'OPERATING PRINCIPLE: WASTE LESS. SYNC MORE.',
      'cta_heading': "DON'T LET YOUR POTENTIAL GO TO WASTE",
      'cta_sub': 'Join 500+ verified nodes already syncing, collaborating, and securing value across cinema, OTT, and music.'
    },
    hi: {
      'nav_home': 'होम',
      'nav_about': 'परिचय',
      'nav_platform': 'प्लेटफ़ॉर्म',
      'nav_products': 'उत्पाद (मॉड्यूल्स)',
      'nav_nodes': 'नोड्स (कलाकार व कर्मी)',
      'nav_workshops': 'कार्यशालाएं',
      'nav_guilds': 'गिल्ड्स',
      'nav_pricing': 'मूल्य',
      'nav_join': 'पाइपलाइन से जुड़ें',
      'hero_badge': 'भारतीय मनोरंजन जगत का तंत्रिका तंत्र (NERVOUS SYSTEM)',
      'hero_title_1': 'भारतीय मनोरंजन उद्योग में',
      'hero_title_2': 'संसाधनों की बर्बादी एक संकट है।',
      'hero_title_3': 'हम इसका स्थायी समाधान हैं।',
      'hero_sub': 'डिजीसिंक (Digisynq) एक सिंक-प्रथम, एसेट-लाइट पाइपलाइन है जो भारतीय मनोरंजन के हर नोड को जोड़ती है — खाली बैठे हुनर को सक्रिय करती है और अटकी परियोजनाओं को पुनर्जीवित करती है।',
      'btn_join_pipeline': 'पाइपलाइन से जुड़ें',
      'btn_explore_platform': 'प्लेटफ़ॉर्म देखें',
      'proof_text': '20+ भाषाओं और 5+ माध्यमों में 500+ नोड्स द्वारा विश्वसनीय',
      'stat_loss_title': '₹500+ करोड़',
      'stat_loss_desc': 'हर साल अप्रयुक्त उत्पादन पूंजी में बर्बाद',
      'stat_idle_title': '50,000+',
      'stat_idle_desc': 'शूटिंग के बीच खाली बैठे कुशल तकनीशियन व कलाकार',
      'stat_modules_title': '15 मॉड्यूल्स',
      'stat_modules_desc': 'बर्बादी और बाधाओं को खत्म करने के लिए निर्मित',
      'stat_sync_title': '1 नेटवर्क',
      'stat_sync_desc': 'हुनर, स्क्रिप्ट, उपकरण और पूंजी को सिंक्रोनाइज़ करने के लिए',
      'problem_tag': 'व्यवस्थागत विफलता',
      'problem_heading': 'अलग-थलग रहना ही बर्बादी है',
      'problem_sub': 'भारतीय सिनेमा और डिजिटल मीडिया भारी बिखराव से पीड़ित है। जब लोग आपस में नहीं जुड़ते, तो पूंजी जलती है और रचनात्मकता दम तोड़ती है।',
      'solution_tag': 'प्रवाह की संरचना',
      'solution_heading': 'हम दीवारों के आर-पार रास्ते बनाते हैं',
      'solution_sub': 'ABCDEF पाइपलाइन बिखरे हुए रचनाकारों और अटकी हुई फिल्मों को एक सुगम, तेज नेटवर्क में बदल देती है।',
      'cta_tag': 'कार्य सिद्धांत: व्यर्थता घटाएं। तालमेल बढ़ाएं।',
      'cta_heading': 'अपनी क्षमता को कभी व्यर्थ न होने दें',
      'cta_sub': '500+ सत्यापित नोड्स के साथ जुड़ें जो सिनेमा, ओटीटी और संगीत में एक साथ काम कर रहे हैं।'
    }
  };

  function setLanguage(lang) {
    currentLang = lang === 'hi' ? 'hi' : 'en';
    localStorage.setItem('digisynq_lang', currentLang);
    applyTranslations();
    updateToggleButtons();
  }

  function toggleLanguage() {
    setLanguage(currentLang === 'en' ? 'hi' : 'en');
  }

  function applyTranslations() {
    const elements = document.querySelectorAll('[data-i18n]');
    const dict = translations[currentLang] || translations.en;

    elements.forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (dict[key]) {
        el.textContent = dict[key];
      }
    });

    document.documentElement.lang = currentLang;
  }

  function updateToggleButtons() {
    const btns = document.querySelectorAll('.lang-toggle-btn');
    btns.forEach(btn => {
      btn.innerHTML = `<span class="lang-code">🌐</span> ${currentLang.toUpperCase()}`;
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    applyTranslations();
    updateToggleButtons();

    document.body.addEventListener('click', (e) => {
      if (e.target.closest('.lang-toggle-btn')) {
        toggleLanguage();
      }
    });
  });

  return {
    setLanguage,
    toggleLanguage,
    getLanguage: () => currentLang,
    t: (key) => (translations[currentLang] && translations[currentLang][key]) || translations.en[key] || key
  };
})();
