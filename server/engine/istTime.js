// server/engine/istTime.js
// CENTRALIZED INDIAN STANDARD TIME (IST - Asia/Kolkata, UTC+05:30) ENGINE
// Dynamically synchronizes all 15-day rolling windows, theatrical day counts, and sensor timestamps with IST
// Auto-shifts daily: e.g. Sept 26 -> Sept 12–26; tomorrow (Sept 27) -> Sept 13–27.

class ISTTimeEngine {
  /**
   * Returns current Date in Indian Standard Time (UTC+05:30)
   */
  static getNowIST() {
    return new Date();
  }

  /**
   * Formats a date into human-readable IST string
   * Example: "26 Sep 2026, 01:15:00 PM IST"
   */
  static formatIST(date = new Date(), includeSeconds = true) {
    const d = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
    if (isNaN(d.getTime())) return 'Invalid Date';

    const options = {
      timeZone: 'Asia/Kolkata',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    };

    if (includeSeconds) {
      options.second = '2-digit';
    }

    const formatter = new Intl.DateTimeFormat('en-IN', options);
    return `${formatter.format(d)} IST`;
  }

  /**
   * Returns current IST Date parts { year, month, day, monthName, isoDate }
   */
  static getISTDateParts(date = new Date()) {
    const d = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
    const parts = new Intl.DateTimeFormat('en-IN', {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      monthName: 'long'
    }).formatToParts(d);

    const map = {};
    parts.forEach(p => { map[p.type] = p.value; });

    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const monthNum = parseInt(map.month, 10);
    const monthName = monthNames[monthNum - 1];

    return {
      year: parseInt(map.year, 10),
      month: monthNum,
      day: parseInt(map.day, 10),
      monthName,
      isoDate: `${map.year}-${map.month}-${map.day}`
    };
  }

  /**
   * Computes the dynamic rolling 15-day theatrical window strictly anchored to IST today.
   * If today is September 26, window is September 12 to September 26 (inclusive, 15 days).
   * Tomorrow (September 27), window automatically shifts to September 13 to September 27.
   * As date advances, older movies automatically drop off.
   */
  static get15DayWindowIST(windowDays = 15) {
    const now = new Date();
    const currentParts = this.getISTDateParts(now);
    
    // Start of today in IST (00:00:00.000)
    const istMidnightToday = new Date(Date.UTC(currentParts.year, currentParts.month - 1, currentParts.day, 0, 0, 0));
    const startOfTodayISTMs = istMidnightToday.getTime() - (5.5 * 3600 * 1000);

    // 15 days rolling window inclusive: Today is Day 1; Window start is Today - 14 days
    // e.g. Sept 26 - 14 days = Sept 12. (Sept 12 to Sept 26 = 15 calendar days)
    const minAllowedPubDateMs = startOfTodayISTMs - ((windowDays - 1) * 24 * 3600 * 1000);
    const minParts = this.getISTDateParts(new Date(minAllowedPubDateMs));

    return {
      windowDays,
      referenceDate: currentParts.isoDate,
      referenceDateFormatted: `${currentParts.monthName} ${currentParts.day}, ${currentParts.year}`,
      startDateFormatted: `${minParts.monthName} ${minParts.day}, ${minParts.year}`,
      endDateFormatted: `${currentParts.monthName} ${currentParts.day}, ${currentParts.year}`,
      windowRangeStr: `${minParts.monthName} ${minParts.day} — ${currentParts.monthName} ${currentParts.day}, ${currentParts.year}`,
      minAllowedPubDateMs,
      nowISTFormatted: this.formatIST(now),
      currentParts,
      minParts
    };
  }

  /**
   * Calculates the exact Day in theaters relative to Indian Standard Time today.
   * Returns null if movie is older than 15 days (Day 16+) so it automatically drops off!
   * @param {number|string} releaseDate - Date or day of month in current month
   * @param {number} reportedDay - Reported day count if available
   */
  static calculateTheatricalDay(releaseDate, reportedDay = null) {
    const currentParts = this.getISTDateParts(new Date());

    if (reportedDay !== null && reportedDay !== undefined) {
      if (reportedDay >= 1 && reportedDay <= 15) {
        const approxReleaseDay = Math.max(1, currentParts.day - reportedDay + 1);
        return {
          daysInTheaters: reportedDay,
          isWithinWindow: true,
          releaseTiming: `${currentParts.monthName.slice(0, 4)} ${approxReleaseDay}, ${currentParts.year} (Day ${reportedDay} in theaters)`
        };
      } else {
        // Exceeded 15-day window -> automatically drop off
        return {
          daysInTheaters: reportedDay,
          isWithinWindow: false,
          releaseTiming: `Exceeded 15-day window (Day ${reportedDay})`
        };
      }
    }

    if (typeof releaseDate === 'number') {
      const diff = Math.max(1, currentParts.day - releaseDate + 1);
      const isWithin = diff >= 1 && diff <= 15;
      return {
        daysInTheaters: diff,
        isWithinWindow: isWithin,
        releaseTiming: isWithin
          ? `${currentParts.monthName.slice(0, 4)} ${releaseDate}, ${currentParts.year} (Day ${diff} in theaters)`
          : `Exceeded 15-day window (Day ${diff})`
      };
    }

    if (typeof releaseDate === 'string' || releaseDate instanceof Date) {
      const parsed = new Date(releaseDate);
      if (!isNaN(parsed.getTime())) {
        const relParts = this.getISTDateParts(parsed);
        const currentMidnightUtc = Date.UTC(currentParts.year, currentParts.month - 1, currentParts.day);
        const relMidnightUtc = Date.UTC(relParts.year, relParts.month - 1, relParts.day);
        const dayDiff = Math.floor((currentMidnightUtc - relMidnightUtc) / (24 * 3600 * 1000)) + 1;
        const isWithin = dayDiff >= 1 && dayDiff <= 15;
        return {
          daysInTheaters: dayDiff,
          isWithinWindow: isWithin,
          releaseTiming: isWithin
            ? `${relParts.monthName.slice(0, 4)} ${relParts.day}, ${relParts.year} (Day ${dayDiff} in theaters)`
            : `Exceeded 15-day window (Day ${dayDiff})`
        };
      }
    }

    return {
      daysInTheaters: 1,
      isWithinWindow: true,
      releaseTiming: `${currentParts.monthName.slice(0, 4)} ${currentParts.day}, ${currentParts.year} (Day 1 in theaters)`
    };
  }
}

module.exports = { ISTTimeEngine };
