import React, { useEffect, useRef} from 'react';
import "./css/ShadowCalendarElement.css";

const ShadowCalendarElement = ({
    participantId
}) => {

    const calendarRootRef = useRef(null);

    const zoomRef = useRef(200);

    const handleZoom = (event) => {
        const calendarRoot = calendarRootRef.current;
        const rect = calendarRoot.getBoundingClientRect();
        const isOverCalendar = event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom;
        if (isOverCalendar && event.ctrlKey) {
            event.preventDefault();
            zoomCalendar(event.deltaY);
        }
    }

    function zoomCalendar(deltaY) {
        const calendarRoot = calendarRootRef.current;
        let zoomLevel = deltaY > 0 ? 10 : -10;
        zoomRef.current += zoomLevel;
        zoomRef.current = Math.max(100, Math.min(400, zoomRef.current));
        const weekBody = calendarRoot.querySelector('.sc-week-body');
        weekBody.style.height = `${zoomRef.current}%`;
    }

    useEffect(() => {
        window.addEventListener('wheel', handleZoom, { passive: false });

        return () => {
            window.removeEventListener('wheel', handleZoom);
        };
    }, []);


    // TODO: fetch calendar data from server 
    // (use api endpoint that converts data format)
    // dummy data for testing

    const busyTimes = [
        {
            start: new Date("2025-05-01T08:00:00"),
            end: new Date("2025-05-01T09:30:00")
        },
        {
            start: new Date("2025-05-01T10:30:00"),
            end: new Date("2025-05-01T12:00:00")
        },
        {
            start: new Date("2025-05-01T14:00:00"),
            end: new Date("2025-05-01T15:30:00")
        }
    ];

    const freeTimes = [
        {
            start: new Date("2025-05-01T09:30:00"),
            end: new Date("2025-05-01T10:30:00")
        },
        {
            start: new Date("2025-05-01T12:00:00"),
            end: new Date("2025-05-01T14:00:00")
        },
        {
            start: new Date("2025-05-01T15:30:00"),
            end: new Date("2025-05-01T17:00:00")
        }
    ];

    //TODO: calculate calendar variables

    const week = {
        start: 5,
        end: 11,
        month: "May",
        year: 2025,
        num: 19,
    }

    const dayNames = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
    const weekDayInfo = [];

    for (let date = week.start; date <= week.end; date++) {
        const d = new Date(`${week.month} ${date}, ${week.year}`);
        const dayName = dayNames[d.getDay()];
        weekDayInfo.push({ day: dayName, num: date });
    }

    const timeSlots = Array.from({ length: 23 }, (_, i) => {
        const hour = i+1;
        return `${hour.toString().padStart(2, '0')}:00`;
    });
    
    
    return (
        <div className="sc-root">
            <div className="sc-header">
                <div className="sc-change-week-buttons">
                    <button type="button" className="sc-change-week-button">&lt;</button>
                    <button type="button" className="sc-change-week-button">&gt;</button>
                </div>
                <div className="sc-week-details">
                    {week.month} {week.start} - {week.end}, {week.year} (week {week.num})
                </div>
            </div>
            <div className="sc-body">
                <div className="sc-week-header">
                    {weekDayInfo.map((weekDay)=>(
                        <div key={weekDay.day} className="sc-day-header">
                            <div className="sc-day-initial">{weekDay.day}</div>
                            <div className="sc-day-number">{weekDay.num}</div>
                        </div>
                    ))}
                </div>
                <div className="sc-week-calendar-area" ref={calendarRootRef}>
                    <div className="sc-week-body">
                        <div className="sc-time-ruler">
                            <div className="cs-time-start-end-separator"></div>
                            {timeSlots.map((time, i) => (
                                <div key={i} className="sc-time">{time}</div>
                            ))}
                            <div className="cs-time-start-end-separator"></div>
                        </div>
                        <div className="sc-grid">
                            {Array.from({ length: 7 * 24 }, (_, index) => {
                                const dayIndex = Math.floor(index / 24);
                                const hourIndex = index % 24;
                                return (
                                    <div
                                        key={`${dayIndex}-${hourIndex}`}
                                        className="sc-grid-cell"
                                        style={{
                                            gridColumn: dayIndex + 1,
                                            gridRow: `${hourIndex + 1} / ${hourIndex + 2}`,
                                        }}
                                        day={dayIndex}
                                        hour={hourIndex}
                                    ></div>
                                );
                            })}

                            <div className="sc-busy-time"
                            style={{
                                top: `${(5+30/60)/24*100}%`, // Starts at 5:30
                                left: `${2/7*100}%`,        // 3th day
                                height: `${240/60/24*100}%`,// 240 minutes long
                            }}></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShadowCalendarElement;