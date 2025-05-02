package fi.lammas.backend.model;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;
import java.time.LocalDateTime;


public class TimePeriodTest {

    @Test
    void testSetTimePeriod() {
        TimePeriod timePeriod = new TimePeriod(LocalDateTime.of(2023, 10, 1, 10, 0), LocalDateTime.of(2023, 10, 1, 12, 0));
        assertEquals(LocalDateTime.of(2023, 10, 1, 10, 0), timePeriod.getStartTime(), "Start time should be set correctly");
        assertEquals(LocalDateTime.of(2023, 10, 1, 12, 0), timePeriod.getEndTime(), "End time should be set correctly");

        assertEquals("TimePeriod{" +
                "startTime=" + LocalDateTime.of(2023, 10, 1, 10, 0) +
                ", endTime=" + LocalDateTime.of(2023, 10, 1, 12, 0) +
                '}', timePeriod.toString(), "toString() should return the correct string representation");
    }
}
