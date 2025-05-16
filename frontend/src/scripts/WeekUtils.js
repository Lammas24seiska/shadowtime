const WeekUtils = {

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

    getWeekNumber(date) {
        const d = new Date(date);
        d.setHours(0, 0, 0, 0);
        d.setDate(d.getDate() + 4 - (d.getDay() || 7));
        const yearStart = new Date(d.getFullYear(), 0, 1);
        return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
    },

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

    getWeekIndex(start, end, cw) {
        const startOfWeek = new Date(cw.year, cw.month - 1, cw.start);
        const endOfWeek = new Date(startOfWeek.getTime());
        endOfWeek.setDate(startOfWeek.getDate() + 6);

        startOfWeek.setHours(0, 0, 0, 0);
        endOfWeek.setHours(23, 59, 59, 999);

        if (start >= startOfWeek && start <= endOfWeek) {
            const startHour = start.getHours();
            const startMinute = start.getMinutes();
            const startDay = start.getDay() -1;
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