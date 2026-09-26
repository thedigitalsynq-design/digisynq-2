// server/test-15days.js
const { XMLParser } = require('fast-xml-parser');

async function get15DaysReleases() {
  const parser = new XMLParser();
  const queries = [
    'Indian movies released in theatres September 2026',
    'theatrical releases September 2026 box office Bollywood Tollywood Kollywood',
    'box office collection day 1 OR day 2 OR day 3 OR day 4 OR day 5 OR day 6 September 2026'
  ];

  const candidateReleases = new Map();

  for (const q of queries) {
    const url = `https://news.google.com/rss/search?q=${encodeURIComponent(q)}&hl=en-IN&gl=IN&ceid=IN:en`;
    try {
      const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
      if (!res.ok) continue;
      const xml = await res.text();
      const data = parser.parse(xml);
      const items = data.rss?.channel?.item || [];
      const arr = Array.isArray(items) ? items : [items];

      for (const item of arr) {
        const title = item.title?.split(' - ')[0] || '';
        const desc = item.description || '';
        const combined = `${title} ${desc}`;

        // Look for day count patterns: "day 1", "day 2", "day 3", ... up to "day 15"
        const dayMatch = combined.match(/\bday\s+([1-9]|1[0-5])\b/i);
        // Look for September release date patterns: "Sept 18", "September 24", "Sep 11", etc.
        const dateMatch = combined.match(/\b(?:Sept|September|Sep)\s+(1[0-9]|2[0-5])\b/i);
        // Look for Friday release patterns: "Friday (Sep 18)", "this week", etc.
        const weekMatch = combined.match(/releases\s+this\s+week\s+\((?:sep|september)\s+(\d+)\)/i);

        // Extract movie title using established patterns
        const nameMatches = [
          title.match(/['"‘“]([^'"’“”]{2,30})['"’”]\s*(?:box office|day|collection|film|movie|earns|races|inches)/i),
          title.match(/^([A-Z0-9][A-Za-z0-9\s:]{2,28}?)\s*(?:worldwide box office|box office collection|day\s+\d+|film review|movie review|box office:)/i),
          title.match(/Nani[’']s\s+([A-Z0-9][A-Za-z0-9\s]{2,25})/i),
          title.match(/([A-Z0-9][A-Za-z0-9\s:]{2,28}?)\s+vs\s+([A-Z0-9][A-Za-z0-9\s:]{2,28}?)\s+Box Office/i)
        ];

        let extractedTitles = [];
        if (title.includes('vs') && nameMatches[3]) {
          extractedTitles.push(nameMatches[3][1].trim(), nameMatches[3][2].trim());
        } else {
          for (const m of nameMatches) {
            if (m && m[1]) {
              extractedTitles.push(m[1].trim());
              break;
            }
          }
        }

        const blacklist = ['bollywood', 'box office', 'indian cinema', 'hollywood', 'south indian', 'times of india', 'ndtv'];

        for (let rawName of extractedTitles) {
          rawName = rawName.replace(/\s+(?:worldwide|day\s+\d+|closing collection)$/i, '').trim();
          rawName = rawName.replace(/[.,:;!?'"’“”]+$/, '').trim();
          const lower = rawName.toLowerCase();

          if (rawName.length >= 3 && rawName.length <= 30 && !blacklist.includes(lower) && !/^\d+$/.test(rawName)) {
            const norm = rawName
              .split(' ')
              .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
              .join(' ');

            let releaseEstimate = 'Last 15 Days (Sept 10 - 25)';
            let daysInTheaters = null;

            if (dayMatch) {
              const dayNum = parseInt(dayMatch[1], 10);
              daysInTheaters = dayNum;
              const approxDay = 25 - dayNum + 1;
              releaseEstimate = `Released approx. Sept ${approxDay}, 2026 (Day ${dayNum} in theaters)`;
            } else if (dateMatch) {
              const dayNum = parseInt(dateMatch[1], 10);
              releaseEstimate = `Released on Sept ${dayNum}, 2026`;
            } else if (weekMatch) {
              releaseEstimate = `Released on Sept ${weekMatch[1]}, 2026`;
            }

            if (!candidateReleases.has(norm)) {
              candidateReleases.set(norm, {
                title: norm,
                releaseEstimate,
                daysInTheaters: daysInTheaters || 7,
                signals: [],
                latestHeadline: title,
                publisher: item.source?.['#text'] || 'Indian Press',
                url: item.link || '#'
              });
            }

            const rec = candidateReleases.get(norm);
            rec.signals.push(item);
            if (daysInTheaters && (!rec.daysInTheaters || daysInTheaters < rec.daysInTheaters)) {
              rec.daysInTheaters = daysInTheaters;
              rec.releaseEstimate = releaseEstimate;
            }
          }
        }
      }
    } catch (e) {
      console.error(e.message);
    }
  }

  // Sort by most recent release (smallest daysInTheaters or highest signal count)
  const sorted = Array.from(candidateReleases.values())
    .filter(m => m.signals.length >= 1)
    .sort((a, b) => a.daysInTheaters - b.daysInTheaters || b.signals.length - a.signals.length);

  console.log('\n=== REAL-TIME INDIAN MOVIES RELEASED IN LAST 15 DAYS (Sept 10 - 25, 2026) ===');
  sorted.forEach(m => {
    console.log(`• ${m.title} | ${m.releaseEstimate} | ${m.signals.length} articles`);
    console.log(`  Headline: "${m.latestHeadline}" (${m.publisher})\n`);
  });

  return sorted;
}

get15DaysReleases();
