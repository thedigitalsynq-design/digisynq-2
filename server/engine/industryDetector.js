// server/engine/industryDetector.js
// Multi-Industry Indian Cinema Taxonomy & Language Classifier
// Categorizes theatrical releases across Sandalwood (Kannada), Tollywood (Telugu), Kollywood (Tamil), Mollywood (Malayalam), and Bollywood (Hindi)

function detectIndustry(title = '', headline = '', desc = '') {
  const lowerTitle = (title || '').toString().toLowerCase().trim();
  const safeHeadline = typeof headline === 'string' 
    ? headline 
    : (Array.isArray(headline) ? headline.map(h => typeof h === 'string' ? h : (h?.title || '')).join(' ') : '');
  const safeDesc = typeof desc === 'string' ? desc : '';
  const combined = `${lowerTitle} ${safeHeadline.toLowerCase()} ${safeDesc.toLowerCase()}`;

  // PRIORITY 1: Explicit Canonical Title Mapping (Deterministic Ground Truth)
  // Sandalwood (Kannada)
  if (
    /toxic|karavali|max|love mocktail|kd the devil|kd – the devil|kabzaa|mother promise|heggana muddu|city lights|citylights|kantara|agadha|america america 2|spark|video/.test(lowerTitle)
  ) {
    return {
      industry: 'Kannada',
      industryLabel: 'Kannada (Sandalwood)',
      badgeColor: 'amber',
      pillClass: 'bg-amber-500/10 text-amber-400 border-amber-500/30'
    };
  }

  // Tollywood (Telugu)
  if (
    /the paradise|paradise|peddi|ustaad bhagat singh|the raja saab|raja saab|anumana pakshi|devara|game changer|saripodhaa|og|pushpa/.test(lowerTitle)
  ) {
    return {
      industry: 'Telugu',
      industryLabel: 'Telugu (Tollywood)',
      badgeColor: 'cyan',
      pillClass: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
    };
  }

  // Kollywood (Tamil)
  if (
    /dorothy|meesaya murukku|mandaadi|sardar 2|sardaar 2|gdn|jana nayagan|vishwanath and sons|karuppu|magudam|blast|coolie|thug life|viduthalai|indian 2|goat|revolver rita|vaa vaathiyaar/.test(lowerTitle)
  ) {
    return {
      industry: 'Tamil',
      industryLabel: 'Tamil (Kollywood)',
      badgeColor: 'rose',
      pillClass: 'bg-rose-500/10 text-rose-400 border-rose-500/30'
    };
  }

  // Mollywood (Malayalam)
  if (
    /i'm game|i’m game|im game|bethlehem kudumba unit|bethlehem|pradhama drishtya|marco|khalifa|ananthan kaadu|pennum porattum|aasha|drishyam|kattalan|varavu|prince of mollywood|idhayam murali/.test(lowerTitle)
  ) {
    return {
      industry: 'Malayalam',
      industryLabel: 'Malayalam (Mollywood)',
      badgeColor: 'emerald',
      pillClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
    };
  }

  // Bollywood (Hindi)
  if (
    /vibe|haiwaan|the vvaan|vvaan|vvan|daayra|mirzapur|awarapan 2|welcome to the jungle|cocktail 2|dhamaal 4|batwara 1947|alpha|chand mera dil|bhooth bangla|stree 2/.test(lowerTitle)
  ) {
    return {
      industry: 'Hindi',
      industryLabel: 'Hindi (Bollywood)',
      badgeColor: 'purple',
      pillClass: 'bg-purple-500/10 text-purple-400 border-purple-500/30'
    };
  }

  // PRIORITY 2: Contextual keywords from headline and article body
  // Kannada keywords
  if (/kannada|sandalwood|yash|prajwal devaraj|raj b\. shetty|rishab shetty|rakshit|kantara|shivarajkumar|sudeep|upendra|duniya vijay|vinay rajkumar/.test(combined)) {
    return {
      industry: 'Kannada',
      industryLabel: 'Kannada (Sandalwood)',
      badgeColor: 'amber',
      pillClass: 'bg-amber-500/10 text-amber-400 border-amber-500/30'
    };
  }

  // Telugu keywords
  if (/telugu|tollywood|nani|ram charan|kayadu lohar|allu arjun|prabhas|mahesh babu|jr ntr|chiranjeevi|balakrishna/.test(combined)) {
    return {
      industry: 'Telugu',
      industryLabel: 'Telugu (Tollywood)',
      badgeColor: 'cyan',
      pillClass: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
    };
  }

  // Tamil keywords
  if (/tamil|kollywood|keerthy suresh|karthik subbaraj|hiphop tamizha|soori|karthi|rajinikanth|kamal haasan|thalapathy|vijay|suriya|dhanush/.test(combined)) {
    return {
      industry: 'Tamil',
      industryLabel: 'Tamil (Kollywood)',
      badgeColor: 'rose',
      pillClass: 'bg-rose-500/10 text-rose-400 border-rose-500/30'
    };
  }

  // Malayalam keywords
  if (/malayalam|mollywood|dulquer salmaan|dulquer|nivin pauly|mamitha baiju|mammootty|mohanlal|fahadh faasil|tovino|parvathy thiruvothu|kerala/.test(combined)) {
    return {
      industry: 'Malayalam',
      industryLabel: 'Malayalam (Mollywood)',
      badgeColor: 'emerald',
      pillClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
    };
  }

  // Hindi keywords
  if (/hindi|bollywood|kareena kapoor|sidharth malhotra|kunal kemmu|preity zinta|tamannaah|shah rukh|salman|aamir|ranbir|alia bhatt/.test(combined)) {
    return {
      industry: 'Hindi',
      industryLabel: 'Hindi (Bollywood)',
      badgeColor: 'purple',
      pillClass: 'bg-purple-500/10 text-purple-400 border-purple-500/30'
    };
  }

  return {
    industry: 'Pan-Indian',
    industryLabel: 'Indian Cinema',
    badgeColor: 'blue',
    pillClass: 'bg-blue-500/10 text-blue-400 border-blue-500/30'
  };
}

module.exports = { detectIndustry };
