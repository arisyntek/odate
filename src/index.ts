export type Options = {
  /** Return full date with seconds **/
  full?: boolean;
  /** Whether to use 12-hour time (default to 24-hour time) **/
  hour12?: boolean;
  /** Add "Today" prefix to time as "Today at 9:00", default just "9:00" for current day **/
  today?: boolean;
};

/**
 * Returns an easy-to-read Date format
 * @param timestamp String or Number timestamp or Date
 * @param options Additional options
 * @return formatted String
 */
export function formatDate(timestamp: number | string | Date, options?: Options): string {
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
    second: options?.full ? '2-digit' : undefined,
    hour12: options?.hour12 ? true : false
  });

  // Return full Date
  if (options?.full || date > now) return fullDate(date, now, timeFormatter);

  // Calculate time difference
  const diffMs = now.getTime() - date.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);

  // Show relative time for recent timestamps
  if (diffSeconds < 10) {
    return 'just now';
  } else if (diffSeconds < 60) {
    return 'a moment ago';
  } else if (diffMinutes < 5) {
    return `${diffMinutes === 1 ? 'a minute' : `${diffMinutes} minutes`} ago`;
  }

  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);

  if (isSameDay(date, now)) {
    // Today
    return `${options?.today ? 'Today at ' : ''}` + timeFormatter.format(date);
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
