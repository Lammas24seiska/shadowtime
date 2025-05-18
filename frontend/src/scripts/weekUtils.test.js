const WeekUtils = require('./WeekUtils.js').default;

describe('WeekUtils', () => {
    describe('getStartOfWeek', () => {
        it('returns correct start of week (Monday)', () => {
            const date = new Date(2025, 4, 18); // Sunday, May 18, 2025
            expect(WeekUtils.getStartOfWeek(date, "Monday")).toBe(12);
        });
        it('returns correct start of week (Sunday)', () => {
            const date = new Date(2025, 4, 18); // Sunday, May 18, 2025
            expect(WeekUtils.getStartOfWeek(date, "Sunday")).toBe(18);
        });
    });

    describe('getEndOfWeek', () => {
        it('returns correct end of week (Monday)', () => {
            const date = new Date(2025, 4, 18); // Sunday, May 18, 2025
            expect(WeekUtils.getEndOfWeek(date, "Monday")).toBe(18);
        });
        it('returns correct end of week (Sunday)', () => {
            const date = new Date(2025, 4, 18); // Sunday, May 18, 2025
            expect(WeekUtils.getEndOfWeek(date, "Sunday")).toBe(24);
        });
    });

    describe('getWeekNumber', () => {
        it('returns correct ISO week number', () => {
            const date = new Date(2025, 4, 18); // Sunday, May 18, 2025
            expect(WeekUtils.getWeekNumber(date)).toBe(20);
        });
    });

    describe('getCurrentWeek', () => {
        it('returns an object with correct keys', () => {
            const cw = WeekUtils.getCurrentWeek();
            expect(cw).toHaveProperty('start');
            expect(cw).toHaveProperty('end');
            expect(cw).toHaveProperty('month');
            expect(cw).toHaveProperty('year');
            expect(cw).toHaveProperty('num');
            expect(cw).toHaveProperty('weekdays');
            expect(Array.isArray(cw.weekdays)).toBe(true);
        });
    });

    describe('getPreviousWeek and getNextWeek', () => {
        it('returns previous week correctly', () => {
            const prev = WeekUtils.getPreviousWeek(18, 5, 2025);
            expect(prev).toHaveProperty('start');
            expect(prev).toHaveProperty('end');
            expect(prev).toHaveProperty('month');
            expect(prev).toHaveProperty('year');
            expect(prev).toHaveProperty('num');
            expect(prev).toHaveProperty('weekdays');
        });
        it('returns next week correctly', () => {
            const next = WeekUtils.getNextWeek(18, 5, 2025);
            expect(next).toHaveProperty('start');
            expect(next).toHaveProperty('end');
            expect(next).toHaveProperty('month');
            expect(next).toHaveProperty('year');
            expect(next).toHaveProperty('num');
            expect(next).toHaveProperty('weekdays');
        });
    });

    describe('getWeekDays', () => {
        it('returns correct weekdays (Monday start)', () => {
            const days = WeekUtils.getWeekDays(new Date(2025, 4, 18), "Monday");
            expect(days.length).toBe(7);
            expect(days[0].day).toBe("MON");
            expect(days[6].day).toBe("SUN");
        });
        it('returns correct weekdays (Sunday start)', () => {
            const days = WeekUtils.getWeekDays(new Date(2025, 4, 18), "Sunday");
            expect(days.length).toBe(7);
            expect(days[0].day).toBe("SUN");
            expect(days[6].day).toBe("SAT");
        });
    });

    describe('getWeekIndex', () => {
        it('returns correct week index for event in current week', () => {
            const cw = WeekUtils.getCurrentWeek();
            const start = new Date(cw.year, cw.month - 1, cw.start, 10, 0);
            const end = new Date(cw.year, cw.month - 1, cw.start, 11, 0);
            const idx = WeekUtils.getWeekIndex(start, end, cw);
            expect(idx).toHaveProperty('startHour', 10);
            expect(idx).toHaveProperty('startMinute', 0);
            expect(idx).toHaveProperty('length', 60);
        });
        it('returns null for event outside current week', () => {
            const cw = WeekUtils.getCurrentWeek();
            const start = new Date(2000, 0, 1, 10, 0);
            const end = new Date(2000, 0, 1, 11, 0);
            expect(WeekUtils.getWeekIndex(start, end, cw)).toBeNull();
        });
    });
});
