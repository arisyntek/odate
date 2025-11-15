/**
 * Returns an easy-to-read Date format
 * @param timestamp Timestamp in String on Number or Date
 * @param full Return full Date
 * @return formatted String
 */
export function formatDate(timestamp: number | string | Date, full?: boolean): string {
  if (!timestamp) return '';

  let date;
  if (timestamp instanceof Date) {
    date = timestamp;
  } else {
    date = toDate(timestamp);
  }

  const now = new Date();

  // TimeFormat
  const timeFormatter = new Intl.DateTimeFormat(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    second: full ? '2-digit' : undefined,
    hour12: false
  });

  // Return full Date
  if (full) return fullDate(date, now, timeFormatter);

  // Calculate time difference
  const diffMs = now.getTime() - date.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);

  // Show relative time for recent timestamps
  if (diffSeconds < 60) {
    return 'seconds ago';
  } else if (diffMinutes < 3) {
    return `${diffMinutes === 1 ? 'minute' : 'minutes'} ago`;
  }

  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);

  if (isSameDay(date, now)) {
    // Today
    return timeFormatter.format(date);
  } else if (isSameDay(date, yesterday)) {
    // Yesterday
    return `Yesterday at ${timeFormatter.format(date)}`;
  }

  // Return full Date
  return fullDate(date, now, timeFormatter);
}

function isSameDay(d1: Date, d2: Date): boolean {
  return (
    d1.getUTCFullYear() === d2.getUTCFullYear() &&
    d1.getUTCMonth() === d2.getUTCMonth() &&
    d1.getUTCDate() === d2.getUTCDate()
  );
}

function isSameYear(d1: Date, d2: Date): boolean {
  return d1.getUTCFullYear() === d2.getUTCFullYear();
}

function fullDate(date: Date, now: Date, timeFormatter: Intl.DateTimeFormat) {
  const timeStr = timeFormatter.format(date);
  const day = date.getDate();
  const month = date.toLocaleString(undefined, { month: 'short' });

  if (isSameYear(date, now)) {
    return `${month} ${day}, ${timeStr}`;
  } else {
    const year = date.getFullYear();
    return `${year} ${month} ${day}, ${timeStr}`;
  }
}

function toDate(timestamp: number | string): Date {
  if (typeof timestamp === 'number') return new Date(timestamp);

  const nano = BigInt(timestamp);
  const millis = Number(nano / 1000000n); // convert to ms
  return new Date(millis);
}
