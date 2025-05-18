import { useEffect, useRef, useState, useCallback, use } from 'react';
import "./css/ShadowCalendarElement.css";
import WeekUtils from "../scripts/WeekUtils.js";

const ShadowCalendarElement = ({
    participantId,
    intervalStartDate,
    intervalEndDate
}) => {
    const [currentWeek, setCurrentWeek] = useState(WeekUtils.getCurrentWeek()); // Selected week on calendar (default: current week)
    const [selectedBusyTimeId, setSelectedBusyTimeId] = useState(null);         // Track selected busy time
    const [busyTimes, setBusyTimes] = useState([]);  // Busy timeslots on calendar (default: empty, fetch from server)
    const calendarRootRef = useRef(null);            // Calendar root element (for zooming)
    const calendarWeekBodyRef = useRef(null);        // Calendar week body element (for resizing)
    const zoomRef = useRef(200);                     // Initial zoom level (default: 200%)
    const mouseup = useRef(null);                    // mouseup event (for resizing)
    const resizingBusyTimeRef = useRef(null);        // The busy time element being resized

    // Handle zooming in and out of the calendar by pressing Ctrl and scrolling
    const handleZoom = useCallback((event) => {

        const calendarRoot = calendarRootRef.current;
        const rect = calendarRoot.getBoundingClientRect();
        const isOverCalendar = event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom;
        
        // If mouse is over the calendar and ctrl key is pressed engage zooming
        if (isOverCalendar && event.ctrlKey) {
            event.preventDefault();
            zoomCalendar(event.deltaY);
        }
    }, []);

    // Handle resizing of busy time slots by dragging the bottom of the box
    const handleResize = (busyTimeId, e) => {
        e.preventDefault();
        let dragging = true;

        resizingBusyTimeRef.current = e.target.parentElement;
        resizingBusyTimeRef.current.dataset.busyTimeId = busyTimeId;

        // Resize busy time when mouse is moved
        function handleMouseMove(e) {
            // Resize if there is a busy time element and the user is dragging
            if (resizingBusyTimeRef.current && dragging) {
                const parent = resizingBusyTimeRef.current;
                const weekBodyRect = calendarWeekBodyRef.current.getBoundingClientRect();
                const busyTimeRect = parent.getBoundingClientRect();
                const mouseY = e.clientY - weekBodyRect.top;
                const busyTimeTop = busyTimeRect.top - weekBodyRect.top;

                // Minimum height of 5px and maximum height to the end of the day
                const maxHeightPx = weekBodyRect.height - busyTimeTop;
                const newHeightPx = Math.min(Math.max(mouseY - busyTimeTop, 5), maxHeightPx);

                // Update the busy time element height
                parent.style.height = `${(newHeightPx / weekBodyRect.height) * 100}%`;

                // Update the new duration to the server
                const newDuration = Math.round((newHeightPx / weekBodyRect.height) * 24 * 60);
                const busyTimeId = Number(parent.dataset.busyTimeId);
                setBusyTimes(prev =>
                    prev.map(bt =>
                        bt.id === busyTimeId
                            ? {
                                ...bt,
                                end: new Date(bt.start.getTime() + newDuration * 60 * 1000)
                            }
                            : bt
                    )
                );
            }
        };

        // End resizing when mouse is released
        function handleMouseUp() {
            dragging = false;
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
            if (mouseup.current) clearTimeout(mouseup.current);
            if (resizingBusyTimeRef.current) {resizingBusyTimeRef.current = null;}
        };

        // Set up event listeners for resizing (move mouse) and ending the resize (mouse up)
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
    };

    // Handle dragging the busy time element
    const handleBusyTimeMouseDown = (busyTimeId, e) => {
        setSelectedBusyTimeId(busyTimeId); // Mark the last dragged element as selected
        let dragging = true;

        // Do not drag element if resizing
        if (e.target.classList.contains("sc-busy-time-resize-handle")) return;

        // Prevent text selection while dragging 
        document.body.style.userSelect = "none";
        document.body.style.webkitUserSelect = "none";
        document.body.style.msUserSelect = "none";
        document.body.style.MozUserSelect = "none";

        // Calculate the current position of the busy time element
        const rect = calendarWeekBodyRef.current.getBoundingClientRect();
        const busyTime = busyTimes.find(bt => bt.id === busyTimeId);
        if (!busyTime) return;
        const weekIdxs = WeekUtils.getWeekIndex(busyTime.start, busyTime.end, currentWeek);
        if (!weekIdxs) return;

        // Calculate the new position of the busy time element
        const startY = e.clientY;
        const startX = e.clientX;
        const origTop = (weekIdxs.startHour + weekIdxs.startMinute / 60) / 24 * rect.height;
        const origLeft = weekIdxs.startDay / 7 * rect.width;
        const duration = weekIdxs.length;

        // When mouse is moved, update the start time of the element
        function onMouseMove(e) {
            if (!dragging) return;
            const deltaY = e.clientY - startY;
            const deltaX = e.clientX - startX;
            const minuteHeight = rect.height / 24 / 60;
            const dayWidth = rect.width / 7;

            // Calculate the new position of the busy time element
            const maxTop = rect.height - (duration * minuteHeight);
            const newTop = Math.max(0, Math.min(maxTop, origTop + deltaY));

            // Calculate the new left position of the busy time element
            const maxLeft = rect.width - dayWidth;
            const newLeft = Math.max(0, Math.min(maxLeft, origLeft + deltaX));

            // Snap to the nearest day and minute
            const snappedDay = Math.max(0, Math.min(6, Math.round(newLeft / dayWidth)));
            const snappedMinute = Math.max(0, Math.min(24 * 60 - duration, Math.round(newTop / minuteHeight)));
            const snappedHour = Math.floor(snappedMinute / 60);
            const snappedMin = snappedMinute % 60;

            // Update the busy time start and end times to server
            const newStart = new Date(currentWeek.year, currentWeek.month - 1, currentWeek.start + snappedDay, snappedHour, snappedMin);
            const newEnd = new Date(newStart.getTime() + duration * 60 * 1000);
            setBusyTimes(prev =>
                prev.map(bt =>
                    bt.id === busyTimeId
                        ? { ...bt, start: newStart, end: newEnd }
                        : bt
                )
            );
        }

        // When mouse is released, stop dragging
        function onMouseUp() {
            dragging = false;
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);
            document.body.style.userSelect = "";
            document.body.style.webkitUserSelect = "";
            document.body.style.msUserSelect = "";
            document.body.style.MozUserSelect = "";
        }

        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
    };

    // Change the relative height of the calendar body based on the zoom level
    function zoomCalendar(deltaY) {
        const zoomLevel = deltaY > 0 ? -10 : 10;
        // Max zoom level is 400% and min zoom level is 100% (all visible)
        zoomRef.current = Math.max(100, Math.min(400, zoomRef.current + zoomLevel));
        calendarWeekBodyRef.current.style.height = `${zoomRef.current}%`;
    }

    // Change the current week to the previous or next week
    function previousWeek() {
        const cw = WeekUtils.getPreviousWeek(currentWeek.start, currentWeek.month, currentWeek.year);
        setCurrentWeek(cw);
    }

    // Change the current week to the next week
    function nextWeek() {
        const cw = WeekUtils.getNextWeek(currentWeek.start, currentWeek.month, currentWeek.year);
        setCurrentWeek(cw);
    }

    // Add a busy time on top of the selected cell
    function addBusyTimeToCell(cell) {
        const startDate = new Date(currentWeek.year, 
                                   currentWeek.month - 1, 
                                   currentWeek.start + parseInt(cell.getAttribute("day")), 
                                   parseInt(cell.getAttribute("hour")), 
                                   0);
        const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // New busy time is 1 hour by default

        // Add the new busy time to the server memory
        setBusyTimes(prev => [...prev, { id: prev.length + 1, start: startDate, end: endDate }]);

        // Make new element selected
        setSelectedBusyTimeId(busyTimes.length + 1); 
    }

    // TODO: put default values to a settings component

    useEffect(() => {
        // Handle zooming of the calendar
        window.addEventListener('wheel', handleZoom, { passive: false });

        // Prevent deletion of calendar elements if not interacting with the calendar
        function handleMouseMove(e) {
            const calendarRoot = calendarRootRef.current;
            if (calendarRoot) {
                const rect = calendarRoot.getBoundingClientRect();
                const mouseX = e.clientX;
                const mouseY = e.clientY;
                const isOverCalendar =
                    mouseX >= rect.left &&
                    mouseX <= rect.right &&
                    mouseY >= rect.top &&
                    mouseY <= rect.bottom;
                if (!isOverCalendar && selectedBusyTimeId !== null) {
                    setSelectedBusyTimeId(null);
                }
            }
        }
        window.addEventListener("mousemove", handleMouseMove);

        // Handle delete key for busy time deletion
        const handleKeyDown = (e) => {
            if (
                e.key === "Delete" &&
                selectedBusyTimeId !== null &&
                selectedBusyTimeId !== undefined
            ) {
                const idToDelete = selectedBusyTimeId;
                setBusyTimes(prev => prev.filter(bt => bt.id !== idToDelete));
                setSelectedBusyTimeId(null);
            }
        };
        document.addEventListener("keydown", handleKeyDown);

        // TODO: fetch calendar data from server and set busy times to it

        return () => {
            window.removeEventListener('wheel', handleZoom);
            window.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [handleZoom, selectedBusyTimeId]);

    // ELEMENT RENDERING

    //  Week information like: < > May 12. - 18. 2025 (week 20)
    const renderHeader = () => {
        const monthNames = [
        "January", "February", "March", "April", "May", "June", "July",
        "August", "September", "October", "November", "December"
        ];

        return (
        <div className="sc-header">
            <div className="sc-change-week-buttons">
                <button type="button" className="sc-change-week-button" onClick={previousWeek}>&lt;</button>
                <button type="button" className="sc-change-week-button" onClick={nextWeek}>&gt;</button>
            </div>
            <div className="sc-week-details">
                {monthNames[currentWeek.month-1]} {currentWeek.start}. - {currentWeek.end}. {currentWeek.year} (week {currentWeek.num})
            </div>
        </div>
        );
    }

    // Calendar weekday headers like: Mon 12, Tue 13, Wed 14, Thu 15, Fri 16, Sat 17, Sun 18
    const renderWeekDayHeaders = () => {
        return (
            <div className="sc-week-header">
                {currentWeek.weekdays.map((weekDay)=>(
                    <div key={weekDay.day} className="sc-day-header">
                        <div className="sc-day-initial">{weekDay.day}</div>
                        <div className="sc-day-number">{weekDay.num}</div>
                    </div>
                ))}
            </div>
        );
    }

    // Time ruler like: 00:00, 01:00, 02:00, ..., 23:00
    const renderTimeRuler = () => {

        const timeSlots = Array.from({ length: 23 }, (_, i) => {
            const hour = i+1;
            return `${hour.toString().padStart(2, '0')}:00`;
        });

        return (
            <>
                <div className="cs-time-start-end-separator"></div>
                {timeSlots.map((time, i) => (
                    <div key={i} className="sc-time">{time}</div>
                ))}
                <div className="cs-time-start-end-separator"></div>
            </>
        );
    }

    // Generate grid cells for each hour of each day (7 days * 24 hours = 168 cells)
    const renderGridCells = () => {
        return (
            <>
            {Array.from({ length: 7 * 24 }, (_, index) => {
                const dayIndex = Math.floor(index / 24);
                const hourIndex = index % 24;
                const cellDate = new Date(
                    currentWeek.year,
                    currentWeek.month - 1,
                    currentWeek.start + dayIndex,
                    hourIndex,
                    0,
                    0,
                    0
                );
                // Make sure the cell date exists and starts at 00:00  and ends at 23:59:59.999
                if (intervalStartDate || intervalEndDate) {
                    cellDate.setMinutes(0, 0, 0);
                }
                let outside = false;
                if (intervalStartDate) {
                    const start = new Date(intervalStartDate);
                    start.setHours(0, 0, 0, 0);
                    if (cellDate < start) {
                        outside = true;
                    }
                }
                if (intervalEndDate) {
                    const end = new Date(intervalEndDate);
                    end.setHours(23, 59, 59, 999);
                    if (cellDate > end) {
                        outside = true;
                    }
                }
                return (
                    <div
                        key={`${dayIndex}-${hourIndex}`}
                        onClick={(e) => {addBusyTimeToCell(e.target)}} 
                        className="sc-grid-cell"
                        style={{
                            gridColumn: dayIndex + 1,
                            gridRow: `${hourIndex + 1} / ${hourIndex + 2}`,
                        }}
                        day={dayIndex}
                        hour={hourIndex}
                        {...(outside ? { outside: "" } : {})} // Color the cell if outside the given interval
                    ></div>
                );
            })}
            </>
        )
    }

    // Handle clicking a busy time to select it
    const handleBusyTimeClick = (busyTimeId, e) => {
        e.stopPropagation();
        setSelectedBusyTimeId(busyTimeId);
    };

    // Render busy times on the calendar
    const renderBusyTimes = () => {
        return (
            <>{busyTimes.map((busyTime) => {
                // Get busy times that are within the current week
                const weekIdxs = WeekUtils.getWeekIndex(busyTime.start, busyTime.end, currentWeek);
                if (!weekIdxs) return null;

                // A movable and resizable box for busy times
                return (
                    <div
                        className="sc-busy-time"
                        key={`${busyTime.id}`}
                        style={{
                            top: `${(weekIdxs.startHour + weekIdxs.startMinute / 60) / 24 * 100}%`,
                            left: `${weekIdxs.startDay / 7 * 100}%`,
                            height: `${(weekIdxs.length) / (60 * 24) * 100}%`,
                        }}
                        draggable={false}
                        onMouseDown={e => handleBusyTimeMouseDown(busyTime.id, e)}
                        onClick={e => handleBusyTimeClick(busyTime.id, e)}
                        data-id={busyTime.id}
                        data-start={busyTime.start}
                        data-end={busyTime.end}
                        {...(selectedBusyTimeId === busyTime.id ? { selected: "" } : {})}
                    >
                        {/* A small transparent box for resizing */}
                        <div
                            className="sc-busy-time-resize-handle"
                            onMouseDown={e => handleResize(busyTime.id, e)}
                        ></div>
                    </div>
                );
            })}</>
        );
    }

    return (
        <div className="sc-root">
            {renderHeader()}
            <div className="sc-body">
                {renderWeekDayHeaders()}
                <div className="sc-week-calendar-area" ref={calendarRootRef}>
                    <div className="sc-week-body" ref={calendarWeekBodyRef}>
                        <div className="sc-time-ruler">
                            {renderTimeRuler()}
                        </div>
                        <div className="sc-grid">
                            {renderGridCells()}
                            {renderBusyTimes()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShadowCalendarElement;