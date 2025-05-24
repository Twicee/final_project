import React from 'react';
import { Link } from 'react-router-dom';
import type { DayEntry } from './LandingPage';

interface DeadlinesPageProps {
  entries: Record<number, DayEntry>;
  monthName?: string;
}

const DEFAULT_MONTH_NAME = 'May 2025';

const DeadlinesPage: React.FC<DeadlinesPageProps> = ({
  entries,
  monthName = DEFAULT_MONTH_NAME,
}) => {
  const allDeadlines: { day: number; text: string; completed: boolean }[] = [];
  Object.entries(entries).forEach(([dayStr, entry]) => {
    const day = Number(dayStr);
    entry.deadlines.forEach(dl => {
      allDeadlines.push({ day, text: dl.text, completed: dl.completed });
    });
  });

  allDeadlines.sort((a, b) => a.day - b.day);

  return (
    <div className="deadlines-page container">
      <h2>View Deadlines</h2>
      <Link to="/" className="btn-back">← Back</Link>

      {allDeadlines.length === 0 ? (
        <p>No deadlines set for {monthName}.</p>
      ) : (
        <ul className="deadlines-list">
          {allDeadlines.map(({ day, text }, idx) => (
            <li key={idx} className="deadline-item">
              <span className="deadline-date">
                {monthName} {day}
              </span>
              <span className="deadline-text">
                {text}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DeadlinesPage;
