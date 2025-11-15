import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { formatDate } from './index';

describe('formatDate', () => {
  let mockNow: Date;

  beforeEach(() => {
    // Mock the current date to 2024-03-15 12:00:00
    mockNow = new Date('2024-03-15T12:00:00Z');
    vi.useFakeTimers();
    vi.setSystemTime(mockNow);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('edge cases', () => {
    it('should return empty string for falsy timestamp', () => {
      expect(formatDate(0)).toBe('');
      expect(formatDate('')).toBe('');
    });
  });

  describe('number timestamps', () => {
    it('should handle timestamp less than 60 seconds ago', () => {
      const timestamp = mockNow.getTime() - 30 * 1000; // 30 seconds ago
      expect(formatDate(timestamp)).toBe('seconds ago');
    });

    it('should handle timestamp exactly 59 seconds ago', () => {
      const timestamp = mockNow.getTime() - 59 * 1000;
      expect(formatDate(timestamp)).toBe('seconds ago');
    });

    it('should handle timestamp 1 minute ago', () => {
      const timestamp = mockNow.getTime() - 60 * 1000; // 1 minute ago
      expect(formatDate(timestamp)).toBe('minute ago');
    });

    it('should handle timestamp 2 minutes ago', () => {
      const timestamp = mockNow.getTime() - 2 * 60 * 1000; // 2 minutes ago
      expect(formatDate(timestamp)).toBe('minutes ago');
    });

    it('should show time only for today (after 3 minutes)', () => {
      const timestamp = mockNow.getTime() - 5 * 60 * 1000; // 5 minutes ago
      const result = formatDate(timestamp);
      // Should return time in HH:mm format
      expect(result).toMatch(/^\d{2}:\d{2}$/);
    });

    it('should show "Yesterday at {time}" for yesterday', () => {
      const yesterday = new Date(mockNow);
      yesterday.setDate(mockNow.getDate() - 1);
      const timestamp = yesterday.getTime();
      const result = formatDate(timestamp);
      expect(result).toMatch(/^Yesterday at \d{2}:\d{2}$/);
    });

    it('should show full date for dates within same year', () => {
      // 2 days ago
      const timestamp = new Date('2024-03-13T10:30:00Z').getTime();
      const result = formatDate(timestamp);
      expect(result).toMatch(/^Mar 13, \d{2}:\d{2}$/);
    });

    it('should show full date with year for dates in different year', () => {
      const timestamp = new Date('2023-12-25T15:45:00Z').getTime();
      const result = formatDate(timestamp);
      expect(result).toMatch(/^2023 Dec 25, \d{2}:\d{2}$/);
    });
  });

  describe('string timestamps (nanoseconds)', () => {
    it('should handle nanosecond timestamp as string', () => {
      // Convert to nanoseconds: milliseconds * 1,000,000
      const timestamp = (mockNow.getTime() - 30 * 1000) * 1000000;
      expect(formatDate(timestamp.toString())).toBe('seconds ago');
    });

    it('should handle nanosecond timestamp for yesterday', () => {
      const yesterday = new Date(mockNow);
      yesterday.setDate(mockNow.getDate() - 1);
      const timestamp = yesterday.getTime() * 1000000;
      const result = formatDate(timestamp.toString());
      expect(result).toMatch(/^Yesterday at \d{2}:\d{2}$/);
    });
  });

  describe('Date object timestamps', () => {
    it('should handle Date object less than 60 seconds ago', () => {
      const date = new Date(mockNow.getTime() - 30 * 1000);
      expect(formatDate(date)).toBe('seconds ago');
    });
  });

  describe('full date format', () => {
    it('should return full date with seconds', () => {
      const timestamp = mockNow.getTime() - 30 * 1000;
      const result = formatDate(timestamp, true);
      // Should include seconds in the time format
      expect(result).toMatch(/^Mar 15, \d{2}:\d{2}:\d{2}$/);
    });
  });

  describe('boundary conditions', () => {
    it('should handle exactly 60 seconds (1 minute)', () => {
      const timestamp = mockNow.getTime() - 60 * 1000;
      expect(formatDate(timestamp)).toBe('minute ago');
    });

    it('should handle exactly 120 seconds (2 minutes)', () => {
      const timestamp = mockNow.getTime() - 120 * 1000;
      expect(formatDate(timestamp)).toBe('minutes ago');
    });

    it('should handle exactly 180 seconds (3 minutes)', () => {
      const timestamp = mockNow.getTime() - 180 * 1000;
      // Should show time, not "minutes ago"
      expect(formatDate(timestamp)).toMatch(/^\d{2}:\d{2}$/);
    });

    it('should handle midnight edge case for same day', () => {
      // Set mock to just after midnight
      const midnight = new Date('2024-03-15T00:01:00Z');
      vi.setSystemTime(midnight);
      // 30 minutes before midnight (still same day)
      const timestamp = new Date('2024-03-14T23:31:00Z').getTime();
      const result = formatDate(timestamp);
      expect(result).toMatch(/^Yesterday at \d{2}:\d{2}$/);
    });
  });
});
