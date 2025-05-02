package fi.lammas.backend.model;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;

public class ShadowCalendarTest {
    @Test
    void testCreateSingleBusyBlocks() {
        ShadowCalendar c1 = new ShadowCalendar();
        assertEquals(0, c1.getBusyTimePeriods().size(), "Calendar should be empty");

        LocalDateTime firstOfOct2023_10 = LocalDateTime.of(2023, 10, 1, 10, 0);
        LocalDateTime firstOfOct2023_12 = LocalDateTime.of(2023, 10, 1, 12, 0);
        LocalDateTime firstOfOct2023_14 = LocalDateTime.of(2023, 10, 1, 14, 0);

        TimePeriod firstOfOct2023_10to12 = new TimePeriod(firstOfOct2023_10, firstOfOct2023_12);
        TimePeriod firstOfOct2023_12to14 = new TimePeriod(firstOfOct2023_12, firstOfOct2023_14);

        ShadowCalendar c2 = new ShadowCalendar(firstOfOct2023_10to12);
        assertEquals(1, c2.getBusyTimePeriods().size(), "Calendar should have exactly one busy time period");

        assertEquals(firstOfOct2023_10, c2.getBusyTimePeriods().get(0).getStartTime(), "The busy time period should start where we wanted it to");
        assertEquals(firstOfOct2023_12, c2.getBusyTimePeriods().get(0).getEndTime(), "The busy time period should end where we wanted it to"); 
    
        ShadowCalendar c3 = new ShadowCalendar(firstOfOct2023_10to12, firstOfOct2023_12to14);
        assertEquals(1, c3.getBusyTimePeriods().size(), "Calendar should have exactly one busy time period");
        assertEquals(firstOfOct2023_10, c3.getBusyTimePeriods().get(0).getStartTime(), "The busy time period should start where we wanted it to");
        assertEquals(firstOfOct2023_14, c3.getBusyTimePeriods().get(0).getEndTime(), "The busy time period should end where we wanted it to"); 
    }

    @Test
    void testCreateSingleBusyBlocks_LeapDay() {
        ShadowCalendar c1 = new ShadowCalendar();
        assertEquals(0, c1.getBusyTimePeriods().size(), "Calendar should be empty");

        LocalDateTime leapDayStart = LocalDateTime.of(2024, 2, 29, 10, 0);
        LocalDateTime leapDayEnd = LocalDateTime.of(2024, 2, 29, 12, 0);

        TimePeriod leapDayPeriod = new TimePeriod(leapDayStart, leapDayEnd);

        ShadowCalendar c2 = new ShadowCalendar(leapDayPeriod);
        assertEquals(1, c2.getBusyTimePeriods().size(), "Calendar should have exactly one busy time period");
        assertEquals(leapDayStart, c2.getBusyTimePeriods().get(0).getStartTime(), "The busy time period should start on leap day");
        assertEquals(leapDayEnd, c2.getBusyTimePeriods().get(0).getEndTime(), "The busy time period should end on leap day");
    }

    @Test
    void testAddFreeTimePeriod() {
        LocalDateTime start = LocalDateTime.of(2023, 10, 1, 10, 0);
        LocalDateTime end = LocalDateTime.of(2023, 10, 1, 12, 0);
        TimePeriod busyPeriod = new TimePeriod(start, end);

        ShadowCalendar calendar = new ShadowCalendar(busyPeriod);
        assertEquals(1, calendar.getBusyTimePeriods().size(), "Calendar should have one busy period");

        calendar.addFreeTimePeriod(busyPeriod);
        assertEquals(0, calendar.getBusyTimePeriods().size(), "Calendar should have no busy periods after freeing");
    }

    @Test
    void testAddFreeTimePeriod_NextYear() {
        LocalDateTime start = LocalDateTime.of(2023, 12, 28, 20, 0);
        LocalDateTime startOfYear = LocalDateTime.of(2024, 1, 1, 0, 0);
        LocalDateTime end = LocalDateTime.of(2024, 3, 2, 10, 0);
        TimePeriod busyPeriod = new TimePeriod(start, end);

        ShadowCalendar calendar = new ShadowCalendar(busyPeriod);
        assertEquals(2, calendar.getBusyTimePeriods().size(), "Calendar should have two busy periods");
        assertEquals(start, calendar.getBusyTimePeriods().get(0).getStartTime(), "The firstbusy time period should start where we wanted it to");
        assertEquals(startOfYear, calendar.getBusyTimePeriods().get(0).getEndTime(), "The first busy time period should end at the start of the next year");
        assertEquals(startOfYear, calendar.getBusyTimePeriods().get(1).getStartTime(), "The second busy time period should start at the start of the next year");
        assertEquals(end, calendar.getBusyTimePeriods().get(1).getEndTime(), "The last busy time period should end where we wanted it to");

        calendar.addFreeTimePeriod(busyPeriod);
        assertEquals(0, calendar.getBusyTimePeriods().size(), "Calendar should have no busy periods after freeing");
    }

    @Test
    void testIsBusyAndIsFree() {
        LocalDateTime start = LocalDateTime.of(2023, 10, 1, 10, 0);
        LocalDateTime end = LocalDateTime.of(2023, 10, 1, 12, 0);
        TimePeriod busyPeriod = new TimePeriod(start, end);

        ShadowCalendar calendar = new ShadowCalendar(busyPeriod);
        assertEquals(true, calendar.isBusy(busyPeriod), "The period should be marked as busy");
        assertEquals(false, calendar.isFree(busyPeriod), "The period should not be marked as free");

        LocalDateTime freeStart = LocalDateTime.of(2023, 10, 1, 12, 0);
        LocalDateTime freeEnd = LocalDateTime.of(2023, 10, 1, 14, 0);
        TimePeriod freePeriod = new TimePeriod(freeStart, freeEnd);

        assertEquals(false, calendar.isBusy(freePeriod), "The period should not be marked as busy");
        assertEquals(true, calendar.isFree(freePeriod), "The period should be marked as free");
    }

    @Test
    void testIsBusyAndIsFree_ShortPeriod() {
        LocalDateTime start = LocalDateTime.of(2023, 10, 1, 10, 0);
        LocalDateTime end = LocalDateTime.of(2023, 10, 1, 10, 1); // 1-minute period
        TimePeriod busyPeriod = new TimePeriod(start, end);

        ShadowCalendar calendar = new ShadowCalendar(busyPeriod);
        assertEquals(true, calendar.isBusy(busyPeriod), "The short period should be marked as busy");
        assertEquals(false, calendar.isFree(busyPeriod), "The short period should not be marked as free");
    }

    @Test
    void testAddOverlappingBusyTimePeriod() {
        LocalDateTime start1 = LocalDateTime.of(2023, 10, 1, 10, 0);
        LocalDateTime end1 = LocalDateTime.of(2023, 10, 1, 12, 0);
        TimePeriod period1 = new TimePeriod(start1, end1);

        LocalDateTime start2 = LocalDateTime.of(2023, 10, 1, 11, 0);
        LocalDateTime end2 = LocalDateTime.of(2023, 10, 1, 13, 0);
        TimePeriod period2 = new TimePeriod(start2, end2);

        ShadowCalendar calendar = new ShadowCalendar(period1);
        calendar.addBusyTimePeriod(period2);

        assertEquals(1, calendar.getBusyTimePeriods().size(), "Calendar should have one busy period after adding overlapping period");
        assertEquals(start1, calendar.getBusyTimePeriods().get(0).getStartTime(), "The busy time period should start at the earliest start time");
        assertEquals(end2, calendar.getBusyTimePeriods().get(0).getEndTime(), "The busy time period should end at the latest end time");
    }

    @Test
    void testAddOverlappingBusyTimePeriod_LongPeriod() {
        LocalDateTime start1 = LocalDateTime.of(2023, 1, 1, 0, 0);
        LocalDateTime end1 = LocalDateTime.of(2023, 12, 31, 23, 59); // Entire year
        TimePeriod period1 = new TimePeriod(start1, end1);

        LocalDateTime start2 = LocalDateTime.of(2023, 6, 10, 0, 0);
        LocalDateTime end2 = LocalDateTime.of(2024, 6, 1, 0, 0); // Overlaps into the next year
        TimePeriod period2 = new TimePeriod(start2, end2);

        ShadowCalendar calendar = new ShadowCalendar(period1);
        calendar.addBusyTimePeriod(period2);

        assertEquals(2, calendar.getBusyTimePeriods().size(), "Calendar should have two busy periods because the the period goes into the next year");
        assertEquals(start1, calendar.getBusyTimePeriods().get(0).getStartTime(), "The busy time period should start at the earliest start time");
        assertEquals(end2, calendar.getBusyTimePeriods().get(1).getEndTime(), "The busy time period should end at the latest end time");
    }

    @Test
    void testIntersectCalendars() {
        LocalDateTime start1 = LocalDateTime.of(2023, 10, 1, 10, 0);
        LocalDateTime end1 = LocalDateTime.of(2023, 10, 1, 12, 0);
        TimePeriod period1 = new TimePeriod(start1, end1);

        LocalDateTime start2 = LocalDateTime.of(2023, 10, 1, 11, 0);
        LocalDateTime end2 = LocalDateTime.of(2023, 10, 1, 13, 0);
        TimePeriod period2 = new TimePeriod(start2, end2);

        ShadowCalendar calendar1 = new ShadowCalendar(period1);
        ShadowCalendar calendar2 = new ShadowCalendar(period2);

        ShadowCalendar intersection = calendar1.intersect(calendar2);
        assertEquals(1, intersection.getBusyTimePeriods().size(), "Intersection should result in one busy period");
        assertEquals(start2, intersection.getBusyTimePeriods().get(0).getStartTime(), "Intersection start time should match");
        assertEquals(end1, intersection.getBusyTimePeriods().get(0).getEndTime(), "Intersection end time should match");
    }

    @Test
    void testIntersectCalendars_LeapYear() {
        LocalDateTime start1 = LocalDateTime.of(2024, 2, 28, 23, 0);
        LocalDateTime end1 = LocalDateTime.of(2024, 2, 29, 1, 0); // Leap day
        TimePeriod period1 = new TimePeriod(start1, end1);

        LocalDateTime start2 = LocalDateTime.of(2024, 2, 29, 0, 0);
        LocalDateTime end2 = LocalDateTime.of(2024, 2, 29, 2, 0);
        TimePeriod period2 = new TimePeriod(start2, end2);

        ShadowCalendar calendar1 = new ShadowCalendar(period1);
        ShadowCalendar calendar2 = new ShadowCalendar(period2);

        ShadowCalendar intersection = calendar1.intersect(calendar2);
        assertEquals(1, intersection.getBusyTimePeriods().size(), "Intersection should result in one busy period");
        assertEquals(start2, intersection.getBusyTimePeriods().get(0).getStartTime(), "Intersection start time should match");
        assertEquals(end1, intersection.getBusyTimePeriods().get(0).getEndTime(), "Intersection end time should match");
    }

    @Test
    void testAddContainedBusyTimePeriod() {
        LocalDateTime start1 = LocalDateTime.of(2023, 10, 1, 10, 0);
        LocalDateTime end1 = LocalDateTime.of(2023, 10, 1, 14, 0);
        TimePeriod period1 = new TimePeriod(start1, end1);

        LocalDateTime start2 = LocalDateTime.of(2023, 10, 1, 11, 0);
        LocalDateTime end2 = LocalDateTime.of(2023, 10, 1, 13, 0);
        TimePeriod period2 = new TimePeriod(start2, end2);

        ShadowCalendar calendar = new ShadowCalendar(period1);
        calendar.addBusyTimePeriod(period2);

        assertEquals(1, calendar.getBusyTimePeriods().size(), "Calendar should still have one busy period after adding contained period");
        assertEquals(start1, calendar.getBusyTimePeriods().get(0).getStartTime(), "The busy time period should start at the original start time");
        assertEquals(end1, calendar.getBusyTimePeriods().get(0).getEndTime(), "The busy time period should end at the original end time");
    }

    @Test
    void testRemovePartiallyOverlappingBusyTimePeriod() {
        LocalDateTime start1 = LocalDateTime.of(2023, 10, 1, 10, 0);
        LocalDateTime end1 = LocalDateTime.of(2023, 10, 1, 14, 0);
        TimePeriod period1 = new TimePeriod(start1, end1);

        LocalDateTime start2 = LocalDateTime.of(2023, 10, 1, 12, 0);
        LocalDateTime end2 = LocalDateTime.of(2023, 10, 1, 16, 0);
        TimePeriod period2 = new TimePeriod(start2, end2);

        ShadowCalendar calendar = new ShadowCalendar(period1);
        calendar.addFreeTimePeriod(period2);

        assertEquals(1, calendar.getBusyTimePeriods().size(), "Calendar should have one busy period after removing partially overlapping period");
        assertEquals(start1, calendar.getBusyTimePeriods().get(0).getStartTime(), "The busy time period should start at the original start time");
        assertEquals(start2, calendar.getBusyTimePeriods().get(0).getEndTime(), "The busy time period should end at the start of the removed period");
    }

    @Test
    void testEmptyCalendarBehavior() {
        ShadowCalendar calendar = new ShadowCalendar();
        assertEquals(0, calendar.getBusyTimePeriods().size(), "Empty calendar should have no busy periods");

        LocalDateTime start = LocalDateTime.of(2023, 10, 1, 10, 0);
        LocalDateTime end = LocalDateTime.of(2023, 10, 1, 12, 0);
        TimePeriod period = new TimePeriod(start, end);

        assertEquals(false, calendar.isBusy(period), "Empty calendar should not mark any period as busy");
        assertEquals(true, calendar.isFree(period), "Empty calendar should mark any period as free");
    }

    @Test
    void testUnionOfMultipleCalendars() {
        LocalDateTime start1 = LocalDateTime.of(2023, 10, 1, 10, 0);
        LocalDateTime end1 = LocalDateTime.of(2023, 10, 1, 12, 0);
        TimePeriod period1 = new TimePeriod(start1, end1);

        LocalDateTime start2 = LocalDateTime.of(2023, 10, 1, 13, 0);
        LocalDateTime end2 = LocalDateTime.of(2023, 10, 1, 15, 0);
        TimePeriod period2 = new TimePeriod(start2, end2);

        LocalDateTime start3 = LocalDateTime.of(2023, 10, 1, 16, 0);
        LocalDateTime end3 = LocalDateTime.of(2023, 10, 1, 18, 0);
        TimePeriod period3 = new TimePeriod(start3, end3);

        ShadowCalendar calendar1 = new ShadowCalendar(period1);
        ShadowCalendar calendar2 = new ShadowCalendar(period2);
        ShadowCalendar calendar3 = new ShadowCalendar(period3);

        ShadowCalendar union = calendar1.union(calendar2, calendar3);
        assertEquals(3, union.getBusyTimePeriods().size(), "Union should result in three busy periods");
        assertEquals(start1, union.getBusyTimePeriods().get(0).getStartTime(), "First period start time should match");
        assertEquals(end1, union.getBusyTimePeriods().get(0).getEndTime(), "First period end time should match");
        assertEquals(start2, union.getBusyTimePeriods().get(1).getStartTime(), "Second period start time should match");
        assertEquals(end2, union.getBusyTimePeriods().get(1).getEndTime(), "Second period end time should match");
        assertEquals(start3, union.getBusyTimePeriods().get(2).getStartTime(), "Third period start time should match");
        assertEquals(end3, union.getBusyTimePeriods().get(2).getEndTime(), "Third period end time should match");
    }

    @Test
    void testUnionOfMultipleCalendars_SeparatedByYear() {
        LocalDateTime start1 = LocalDateTime.of(2023, 10, 1, 10, 0);
        LocalDateTime end1 = LocalDateTime.of(2023, 10, 1, 12, 0);
        TimePeriod period1 = new TimePeriod(start1, end1);

        LocalDateTime start2 = LocalDateTime.of(2024, 10, 1, 10, 0);
        LocalDateTime end2 = LocalDateTime.of(2024, 10, 1, 12, 0);
        TimePeriod period2 = new TimePeriod(start2, end2);

        LocalDateTime start3 = LocalDateTime.of(2025, 10, 1, 10, 0);
        LocalDateTime end3 = LocalDateTime.of(2025, 10, 1, 12, 0);
        TimePeriod period3 = new TimePeriod(start3, end3);

        ShadowCalendar calendar1 = new ShadowCalendar(period1);
        ShadowCalendar calendar2 = new ShadowCalendar(period2);
        ShadowCalendar calendar3 = new ShadowCalendar(period3);

        ShadowCalendar union = calendar1.union(calendar2, calendar3);
        assertEquals(3, union.getBusyTimePeriods().size(), "Union should result in three busy periods separated by years");
        assertEquals(start1, union.getBusyTimePeriods().get(0).getStartTime(), "First period start time should match");
        assertEquals(end1, union.getBusyTimePeriods().get(0).getEndTime(), "First period end time should match");
        assertEquals(start2, union.getBusyTimePeriods().get(1).getStartTime(), "Second period start time should match");
        assertEquals(end2, union.getBusyTimePeriods().get(1).getEndTime(), "Second period end time should match");
        assertEquals(start3, union.getBusyTimePeriods().get(2).getStartTime(), "Third period start time should match");
        assertEquals(end3, union.getBusyTimePeriods().get(2).getEndTime(), "Third period end time should match");
    }

    @Test
    void testIntersectionOfMultipleCalendars() {
        LocalDateTime start1 = LocalDateTime.of(2023, 10, 1, 10, 0);
        LocalDateTime end1 = LocalDateTime.of(2023, 10, 1, 14, 0);
        TimePeriod period1 = new TimePeriod(start1, end1);

        LocalDateTime start2 = LocalDateTime.of(2023, 10, 1, 12, 0);
        LocalDateTime end2 = LocalDateTime.of(2023, 10, 1, 16, 0);
        TimePeriod period2 = new TimePeriod(start2, end2);

        LocalDateTime start3 = LocalDateTime.of(2023, 10, 1, 13, 0);
        LocalDateTime end3 = LocalDateTime.of(2023, 10, 1, 15, 0);
        TimePeriod period3 = new TimePeriod(start3, end3);

        ShadowCalendar calendar1 = new ShadowCalendar(period1);
        ShadowCalendar calendar2 = new ShadowCalendar(period2);
        ShadowCalendar calendar3 = new ShadowCalendar(period3);

        ShadowCalendar intersection = calendar1.intersect(calendar2, calendar3);
        assertEquals(1, intersection.getBusyTimePeriods().size(), "Intersection should result in one busy period");
        assertEquals(start3, intersection.getBusyTimePeriods().get(0).getStartTime(), "Intersection start time should match");
        assertEquals(end1, intersection.getBusyTimePeriods().get(0).getEndTime(), "Intersection end time should match");
    }

    @Test
    void testUnionWithIdenticalCalendars() {
        LocalDateTime start = LocalDateTime.of(2023, 10, 1, 10, 0);
        LocalDateTime end = LocalDateTime.of(2023, 10, 1, 12, 0);
        TimePeriod period = new TimePeriod(start, end);

        ShadowCalendar calendar1 = new ShadowCalendar(period);
        ShadowCalendar calendar2 = new ShadowCalendar(period);
        ShadowCalendar calendar3 = new ShadowCalendar(period);

        ShadowCalendar union = calendar1.union(calendar2, calendar3);
        assertEquals(1, union.getBusyTimePeriods().size(), "Union of identical calendars should result in one busy period");
        assertEquals(start, union.getBusyTimePeriods().get(0).getStartTime(), "Union start time should match");
        assertEquals(end, union.getBusyTimePeriods().get(0).getEndTime(), "Union end time should match");
    }

    @Test
    void testIntersectionWithDisjointCalendars() {
        LocalDateTime start1 = LocalDateTime.of(2023, 10, 1, 10, 0);
        LocalDateTime end1 = LocalDateTime.of(2023, 10, 1, 12, 0);
        TimePeriod period1 = new TimePeriod(start1, end1);

        LocalDateTime start2 = LocalDateTime.of(2023, 10, 1, 13, 0);
        LocalDateTime end2 = LocalDateTime.of(2023, 10, 1, 15, 0);
        TimePeriod period2 = new TimePeriod(start2, end2);

        ShadowCalendar calendar1 = new ShadowCalendar(period1);
        ShadowCalendar calendar2 = new ShadowCalendar(period2);

        ShadowCalendar intersection = calendar1.intersect(calendar2);
        assertEquals(0, intersection.getBusyTimePeriods().size(), "Intersection of disjoint calendars should result in no busy periods");
    }

    @Test
    void testUnionAndIntersectionWithFiveCalendars() {
        LocalDateTime start1 = LocalDateTime.of(2023, 10, 1, 10, 0);
        LocalDateTime end1 = LocalDateTime.of(2023, 10, 1, 12, 0);
        TimePeriod period1 = new TimePeriod(start1, end1);

        LocalDateTime start2 = LocalDateTime.of(2023, 10, 1, 11, 0);
        LocalDateTime end2 = LocalDateTime.of(2023, 10, 1, 13, 0);
        TimePeriod period2 = new TimePeriod(start2, end2);

        LocalDateTime start3 = LocalDateTime.of(2023, 10, 1, 12, 0);
        LocalDateTime end3 = LocalDateTime.of(2023, 10, 1, 14, 0);
        TimePeriod period3 = new TimePeriod(start3, end3);

        LocalDateTime start4 = LocalDateTime.of(2023, 10, 1, 13, 0);
        LocalDateTime end4 = LocalDateTime.of(2023, 10, 1, 15, 0);
        TimePeriod period4 = new TimePeriod(start4, end4);

        LocalDateTime start5 = LocalDateTime.of(2023, 10, 1, 14, 0);
        LocalDateTime end5 = LocalDateTime.of(2023, 10, 1, 16, 0);
        TimePeriod period5 = new TimePeriod(start5, end5);

        ShadowCalendar calendar1 = new ShadowCalendar(period1);
        ShadowCalendar calendar2 = new ShadowCalendar(period2);
        ShadowCalendar calendar3 = new ShadowCalendar(period3);
        ShadowCalendar calendar4 = new ShadowCalendar(period4);
        ShadowCalendar calendar5 = new ShadowCalendar(period5);

        ShadowCalendar union = calendar1.union(calendar2, calendar3, calendar4, calendar5);
        assertEquals(1, union.getBusyTimePeriods().size(), "Union of overlapping calendars should result in one continuous busy period");
        assertEquals(start1, union.getBusyTimePeriods().get(0).getStartTime(), "Union start time should match the earliest start time");
        assertEquals(end5, union.getBusyTimePeriods().get(0).getEndTime(), "Union end time should match the latest end time");

        ShadowCalendar intersection = calendar1.intersect(calendar2, calendar3, calendar4, calendar5);
        assertEquals(0, intersection.getBusyTimePeriods().size(), "Intersection of non-overlapping calendars should result in no busy periods");
    }
}
