package fi.lammas.backend.model;

import java.time.LocalDateTime;

/**
 * TimePeriod is a class that represents a time period with a start and end time.
 * It provides methods to get and set the start and end times, as well as a constructor
 * to create a TimePeriod object with specified start and end times.
 * It also validates that the start time is before the end time.
 * 
 * @author Aarni Akkala
 * @version 1.0
 * @since 04-05-2025
 */
public class TimePeriod {
    private LocalDateTime startTime;
    private LocalDateTime endTime;

    /**
     * Constructor for TimePeriod class.
     * @param startTime the start time of the time period
     * @param endTime the end time of the time period
     * @throws IllegalArgumentException if the start time is not before the end time
     */
    public TimePeriod(LocalDateTime startTime, LocalDateTime endTime) {
        this.startTime = startTime;
        this.endTime = endTime;

        checkValidTimePeriod(startTime, endTime);
    }

    public LocalDateTime getStartTime() {
        return startTime;
    }

    public LocalDateTime getEndTime() {
        return endTime;
    }

    /**
     * Create a new timeperiod with the start time as the earliest of the two start times
     * and the end time as the latest of the two end times
     * @param startTime other timeperiod start time
     * @param endTime other timeperiod end time
     * @return a new TimePeriod object with the earliest start time and latest end time
     */
    public TimePeriod createUnion(LocalDateTime startTime, LocalDateTime endTime) {
        LocalDateTime newStartTime = startTime.isBefore(this.startTime) ? startTime : this.startTime;
        LocalDateTime newEndTime = endTime.isAfter(this.endTime) ? endTime : this.endTime;
        return new TimePeriod(newStartTime, newEndTime);
    }

    /**
     * Create a new timeperiod with the start time as the earliest of the two start times
     * and the end time as the latest of the two end times
     * @param other other timeperiod to union with
     * @return a new TimePeriod object with the earliest start time and latest end time
     */
    public TimePeriod createUnion(TimePeriod other) {
        return createUnion(other.getStartTime(), other.getEndTime());
    }

    @Override
    public String toString() {
        return "TimePeriod{" +
                "startTime=" + startTime +
                ", endTime=" + endTime +
                '}';
    }

    /**
     * Checks if the start time is before the end time.
     * @param startTime the start time of the time period
     * @param endTime the end time of the time period
     * @throws IllegalArgumentException if the start time is not before the end time
     * @return true if the start time is before the end time
     */
    private boolean checkValidTimePeriod(LocalDateTime startTime, LocalDateTime endTime) {
        if (startTime.isAfter(endTime)) {
            throw new IllegalArgumentException("Start time must be before end time.");
        }
        return false;
    }
}
