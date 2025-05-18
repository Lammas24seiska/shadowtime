/**
 * WeekUtils.js is a utility module for handling week-related calculations
 * specifically for the shadow calendar application calendar component.
 * It provides functions to get the start and end of the week,
 * calculate the week number, and retrieve the weekdays of a given date.
 * It also includes functions to get the current week, previous week, 
 * and next week based on a given date.
 * 
 * @author Aarni Akkala
 * @version 1.0
 * @date 18-05-2025
 */
const WeekUtils = {

    // TODO: testing (specifically different start days)

    /**
     * Get the start of the week for a given date.
     * @param {Date|string|number} date - The date to get the start of the week for.
     * @param {"Monday"|"Sunday"} startDay - The day to consider as the start of the week (default is "Monday").
     * @returns {number} The day of the month (1–31) that starts the week.
     * @example
     * // Get the start of the week for May 18, 2025 (Sunday as start day)
     * const start = WeekUtils.getStartOfWeek(new Date(2025, 5, 1), "Monday");
     * console.log(start); // Output: 28
     */
    getStartOfWeek(date, startDay = "Monday") {
        const d = new Date(date);
        const day = d.getDay();
        const offset = startDay === "Monday"
            ? (day === 0 ? -6 : 1 - day) 
            : -day;                      
        d.setDate(d.getDate() + offset);
        d.setHours(0, 0, 0, 0);
        return d.getDate();
    },

    /**
     * Get the end of the week for a given date.
     * @param {Date|string|number} date - The date to get the end of the week for.
     * @param {"Monday"|"Sunday"} startDay - The day to consider as the start of the week (default is "Monday").
     * @returns {number} The day of the month (1–31) that ends the week.
     * @example
     * // Get the end of the week for May 18, 2025 (Sunday as start day)
     * const end = WeekUtils.getEndOfWeek(new Date(2025, 5, 1), "Monday");
     * console.log(end); // Output: 4
     */
    getEndOfWeek(date, startDay = "Monday") {
        const d = new Date(date);
        const day = d.getDay();
        const offset = startDay === "Monday"
            ? (day === 0 ? 0 : 7 - day) 
            : 6 - day;                      
        d.setDate(d.getDate() + offset);
        d.setHours(23, 59, 59, 999);
        return d.getDate();
    },

    /**
     * Get the week number for a given date.
     * @param {Date|string|number} date - The date to get the week number for.
     * @returns {number} The week number (1–53) for the given date.
     */
    getWeekNumber(date) {
        const d = new Date(date);
        d.setHours(0, 0, 0, 0);
        d.setDate(d.getDate() + 4 - (d.getDay() || 7));
        const yearStart = new Date(d.getFullYear(), 0, 1);
        return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
    },

    /**
     * @returns {Object} The current week object containing start, end, month, year, week number, and weekdays.
     * @example
     * // Get the current week for today
     * const currentWeek = WeekUtils.getCurrentWeek();
     * console.log(currentWeek);
     */
    getCurrentWeek() {
        const today = new Date();
        return {
            start: this.getStartOfWeek(today),
            end: this.getEndOfWeek(today),
            month: today.getMonth() + 1,
            year: today.getFullYear(),
            num: this.getWeekNumber(today),
            weekdays: this.getWeekDays(today),
        }
    },

    /**
     * Get the previous week for a given date.
     * @param {number} day - The day of the month (1–31).
     * @param {number} month - The month (1–12).
     * @param {number} year - The year (e.g., 2025).
     * @returns {Object} The previous week object containing start, end, month, year, week number, and weekdays.
     */
    getPreviousWeek(day, month, year) {
        const date = new Date(year, month - 1, day);
        date.setDate(date.getDate() - 7);
        return {
            start: this.getStartOfWeek(date),
            end: this.getEndOfWeek(date),
            month: date.getMonth() + 1,
            year: date.getFullYear(),
            num: this.getWeekNumber(date),
            weekdays: this.getWeekDays(date),
        }
    },

    /**
     * Get the next week for a given date.
     * @param {number} day - The day of the month (1–31).
     * @param {number} month - The month (1–12).
     * @param {number} year - The year (e.g., 2025).
     * @returns {Object} The next week object containing start, end, month, year, week number, and weekdays.
     */
    getNextWeek(day, month, year) {
        const date = new Date(year, month - 1, day);
        date.setDate(date.getDate() + 7);
        return {
            start: this.getStartOfWeek(date),
            end: this.getEndOfWeek(date),
            month: date.getMonth() + 1,
            year: date.getFullYear(),
            num: this.getWeekNumber(date),
            weekdays: this.getWeekDays(date),
        }
    },

    /**
     * Get the weekdays for a given date.
     * @param {Date|string|number} date - The date to get the weekdays for.
     * @param {"Monday"|"Sunday"} startDay - The day to consider as the start of the week (default is "Monday").
     * @returns {Array} An array of objects representing the weekdays in the week of the given date.
     * @example
     * // Get the weekdays for May 18, 2025 (Monday as start day)
     * const weekdays = WeekUtils.getWeekDays(new Date(2025, 4, 18), "Monday");
     * console.log(weekdays); // Output: [{day: "MON", num: 12}, {day: "TUE", num: 13}, ...]
     */
    getWeekDays(date, startDay = "Monday") {
        const startOfWeek = new Date(date);
        const offset = this.getStartOfWeek(date, startDay) - startOfWeek.getDate();
        startOfWeek.setDate(startOfWeek.getDate() + offset);

        const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
        const weekDays = [];

        for (let i = 0; i < 7; i++) {
            const day = new Date(startOfWeek.getTime()); 
            day.setDate(startOfWeek.getDate() + i);
            weekDays.push({
                day: days[day.getDay()],
                num: day.getDate()
            });
        }

        return weekDays;
    },

    /**
     * Get the week index for a given time range and current week.
     * @param {Date} start - The start date of the time range.
     * @param {Date} end - The end date of the time range.
     * @param {Object} cw - The current week object.
     * @returns {Object|null} The week index object or null if not in the current week.
     * @example
     * // Get the week index for a time range within the current week
     * const weekIndex = WeekUtils.getWeekIndex(new Date(2025, 4, 18, 10, 15), new Date(2025, 4, 20, 11, 30), currentWeek);
     * console.log(weekIndex); // Output: {startHour: 10, startMinute: 15, startDay: 5, length: 75}
     */
    getWeekIndex(start, end, cw) {
        // TODO: sunday monday compatibility
        const startOfWeek = new Date(cw.year, cw.month - 1, cw.start);
        const endOfWeek = new Date(startOfWeek.getTime());
        endOfWeek.setDate(startOfWeek.getDate() + 6);

        startOfWeek.setHours(0, 0, 0, 0);
        endOfWeek.setHours(23, 59, 59, 999);

        if (start >= startOfWeek && start <= endOfWeek) {
            const startHour = start.getHours();
            const startMinute = start.getMinutes();
            const startDay = (start.getDay() + 6) % 7;
            const length = Math.ceil((end - start) / (1000 * 60));
            return {
                startHour,
                startMinute,
                startDay,
                length,
            };
        }
        return null;
    }


        
}
export default WeekUtils;