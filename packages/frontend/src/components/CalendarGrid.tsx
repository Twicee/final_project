import React from 'react';
import type { DayEntry } from '../pages/LandingPage';

export interface CalendarGridProps {
  monthName: string;           
  daysInMonth: number;         
  firstDayOfWeek: number;      
  entries: Record<number, DayEntry>;
  onDayClick: (day: number) => void;
}

const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const CalendarGrid: React.FC<CalendarGridProps> = ({ monthName, daysInMonth, firstDayOfWeek, entries, onDayClick }) => {
  const totalSlots = firstDayOfWeek + daysInMonth;
  const totalCells = Math.ceil(totalSlots / 7) * 7;
  const cells = Array.from({ length: totalCells }, (_, idx) => {
    const dayNum = idx - firstDayOfWeek + 1;
    return dayNum >= 1 && dayNum <= daysInMonth ? dayNum : null;
  });

  return (
    <section className="calendar-container">
      <h2 className="month-title">{monthName}</h2>
      <div className="calendar-grid" aria-label={`Calendar for ${monthName}`}>
        {weekdays.map(wd => (
          <div key={wd} className="day-label">{wd}</div>
        ))}

        {cells.map((day, idx) => (
          <div
            key={idx}
            className={`day ${day === null ? 'empty' : ''}`}
            role={day ? 'button' : undefined}
            tabIndex={day ? 0 : undefined}
            onClick={() => day && onDayClick(day)}
            onKeyDown={e => day && (e.key === 'Enter' || e.key === ' ') && onDayClick(day)}
            aria-hidden={day === null}
          >
            {day && (
              <>
                <span className="date">{day}</span>
                {entries[day].mood && (
                  <span aria-label={
                      entries[day].mood === '😊' ? 'Happy' :
                      entries[day].mood === '😐' ? 'Neutral' : 'Sad'
                    }>
                    {entries[day].mood}
                  </span>
                )}
                {entries[day].deadlines.length > 0 && (
                  <span className="deadline-indicator" aria-label="Has deadlines">❗</span>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default CalendarGrid;
