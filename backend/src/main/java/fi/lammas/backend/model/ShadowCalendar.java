package fi.lammas.backend.model;

import org.roaringbitmap.RoaringBitmap;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

import java.util.ArrayList;
import java.util.List;

/**
 * ShadowCalendar is a class that represents a calendar with busy and free time periods.
 * It uses RoaringBitmap to efficiently store and manipulate time periods.
 * The calendar supports operations like adding busy/free time periods, checking if a time period is busy/free,
 * and performing intersection (union of free times) 
 * and union (intersection of free times) operations with other shadowcalendars.
 * Supports a range of years from 1970 to 2070.
 * Resolution is in minutes.
 * 
 * @author Aarni Akkala
 * @version 1.0
 * @since 04-05-2025
 */
public class ShadowCalendar {

    // Calendar busy/free time periods are stored in RoaringBitmap arrays, 
    // one for each year. (1=busy, 0=free)
    private final RoaringBitmap[] calendar;

    // Defines the range of years supported by the calendar.
    private static final int EPOCH_YEAR = 1970;
    private static final int MAX_YEARS = 100;

    /**
     * Creates a new ShadowCalendar with the specified busy time periods.
     * @param timePeriods An array of TimePeriod objects representing busy time.
     */
    public ShadowCalendar(TimePeriod... timePeriods) {
        this.calendar = new RoaringBitmap[MAX_YEARS];
        for (int i = 0; i < MAX_YEARS; i++) {
            calendar[i] = new RoaringBitmap();
        }

        for (TimePeriod timePeriod : timePeriods) {
            addBusyTimePeriod(timePeriod);
        }
        
    }

    /**
     * Creates a new empty ShadowCalendar.
     */
    public ShadowCalendar() {
        this.calendar = new RoaringBitmap[MAX_YEARS];
        for (int i = 0; i < MAX_YEARS; i++) {
            calendar[i] = new RoaringBitmap();
        }
    }

    /**
     * Returns a list of busy time periods in the calendar.
     * @return A list of TimePeriod objects representing busy time periods.
     */
    public List<TimePeriod> getBusyTimePeriods() {
        List<TimePeriod> busyTimePeriods = new ArrayList<>();
        for (int year = 0; year < MAX_YEARS; year++) {
            RoaringBitmap bitmap = calendar[year];
            int[] busyMinutes = bitmap.toArray();
            if (busyMinutes.length == 0) continue;
    
            LocalDateTime start = LocalDateTime.of(EPOCH_YEAR + year, 1, 1, 0, 0).plusMinutes(busyMinutes[0]);
            LocalDateTime end = start;
    
            for (int i = 1; i < busyMinutes.length; i++) {
                if (busyMinutes[i] != busyMinutes[i - 1] + 1) {
                    end = end.plusMinutes(1);
                    busyTimePeriods.add(new TimePeriod(start, end));
                    start = LocalDateTime.of(EPOCH_YEAR + year, 1, 1, 0, 0).plusMinutes(busyMinutes[i]);
                }
                end = LocalDateTime.of(EPOCH_YEAR + year, 1, 1, 0, 0).plusMinutes(busyMinutes[i]);
            }
            end = end.plusMinutes(1);
            busyTimePeriods.add(new TimePeriod(start, end));
        }
        return busyTimePeriods;
    }

    /**
     * Adds a busy time period to the calendar.
     * @param timePeriod The TimePeriod object representing the busy time to be added.
     */
    public void addBusyTimePeriod(TimePeriod timePeriod) {
        paintCalendar(timePeriod, true);
    }

    /**
     * Adds a free time period to the calendar. (Overwrites busy times)
     * @param timePeriod The TimePeriod object representing the free time to be added.
     */
    public void addFreeTimePeriod(TimePeriod timePeriod) {
        paintCalendar(timePeriod, false);
    }

    /**
     * Checks if a given time period is busy in the calendar.
     * @param timePeriod The TimePeriod object representing the time period to check.
     * @return true if any part timePeriod overlaps with busy time, false otherwise.
     */
    public boolean isBusy(TimePeriod timePeriod) {
        LocalDateTime start = timePeriod.getStartTime().truncatedTo(ChronoUnit.MINUTES);
        LocalDateTime end = timePeriod.getEndTime().truncatedTo(ChronoUnit.MINUTES);
    
        while (!start.isAfter(end)) {
            int year = start.getYear();
            if (year < EPOCH_YEAR || year >= EPOCH_YEAR + MAX_YEARS) {
                throw new IllegalArgumentException("Year out of supported range");
            }
            int yearIndex = year - EPOCH_YEAR;
            int minute = getTimeIndex(start);
            if (calendar[yearIndex].contains(minute)) {
                return true;
            }
            start = start.plusMinutes(1);
        }
        return false;
    }

    /**
     * Checks if a given time period is free in the calendar.
     * @param timePeriod The TimePeriod object representing the time period to check.
     * @return true if any part timePeriod overlaps with free time, false otherwise.
     */
    public boolean isFree(TimePeriod timePeriod) {
        return !isBusy(timePeriod);
    }

    /**
     * Returns a new ShadowCalendar that represents the intersection of this calendar with other calendars.
     * This means that the resulting calendar will only contain time periods that are busy in ALL calendars.
     * @param otherCalendars An array of other ShadowCalendar objects to intersect with.
     * @return A new ShadowCalendar object representing the intersection of this calendar with the other calendars.
     */
    public ShadowCalendar intersect(ShadowCalendar... otherCalendars) {
        ShadowCalendar result = new ShadowCalendar();
        for (int i = 0; i < MAX_YEARS; i++) {
            RoaringBitmap intersection = calendar[i].clone();
            for (ShadowCalendar other : otherCalendars) {
                intersection.and(other.calendar[i]);
            }
            result.calendar[i] = intersection;
        }
        return result;
    } 

    /**
     * Returns a new ShadowCalendar that represents the union of this calendar with other calendars.
     * This means that the resulting calendar will contain all time periods that are busy in ANY of the calendars.
     * @param otherCalendars An array of other ShadowCalendar objects to union with.
     * @return A new ShadowCalendar object representing the union of this calendar with the other calendars.
     */
    public ShadowCalendar union(ShadowCalendar... otherCalendars) {
        ShadowCalendar result = new ShadowCalendar();
        for (int i = 0; i < MAX_YEARS; i++) {
            RoaringBitmap unionBitmap = calendar[i].clone();
            for (ShadowCalendar other : otherCalendars) {
                unionBitmap.or(other.calendar[i]);
            }
            result.calendar[i] = unionBitmap;
        }
        return result;
    } 

    /**
     * A private method that is used to paint the calendar with busy or free time periods.
     * Overwrites pervious busy/free time periods.
     * @param timePeriod The TimePeriod object representing the time period to be painted.
     * @param isBusy flag to indicate if the time period is to be painted as busy or free.
     */
    private void paintCalendar(TimePeriod timePeriod, boolean isBusy) {
        LocalDateTime start = timePeriod.getStartTime().truncatedTo(ChronoUnit.MINUTES);
        LocalDateTime end = timePeriod.getEndTime().truncatedTo(ChronoUnit.MINUTES).minusMinutes(1); // Exclude the end time
    
        if (start.isAfter(end)) throw new IllegalArgumentException("Start time after end time");
    
        while (!start.isAfter(end)) {
            int year = start.getYear();
            if (year < EPOCH_YEAR || year >= EPOCH_YEAR + MAX_YEARS) {
                throw new IllegalArgumentException("Year out of supported range");
            }
            int yearIndex = year - EPOCH_YEAR;
    
            LocalDateTime endOfThisYear = start.withDayOfYear(start.toLocalDate().lengthOfYear())
                                               .withHour(23).withMinute(59);
            LocalDateTime segmentEnd = end.isBefore(endOfThisYear) ? end : endOfThisYear;
    
            int startMinute = getTimeIndex(start);
            int endMinute = getTimeIndex(segmentEnd);
    
            if (isBusy) {
                calendar[yearIndex].add((long) startMinute, (long) endMinute + 1);
            } else {
                calendar[yearIndex].remove((long) startMinute, (long) endMinute + 1L);
            }
    
            start = segmentEnd.plusMinutes(1);
        }
    }

    /**
     * Calculates the index of a given time in the calendar.
     * The index is calculated as the number of minutes since the start of the year.
     * @param time The LocalDateTime object representing the time to be indexed.
     * @return The index of the time in the calendar.
     */
    private int getTimeIndex(LocalDateTime time) {
        int MINUTES_IN_A_DAY = 24 * 60;
        int MINUTES_IN_AN_HOUR = 60;
        return (time.getDayOfYear() - 1) * MINUTES_IN_A_DAY + time.getHour() * MINUTES_IN_AN_HOUR + time.getMinute();
    }


}
