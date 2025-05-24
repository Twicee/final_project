import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import type { DayEntry, Mood } from './LandingPage';

interface MoodPageProps {
  entries: Record<number, DayEntry>;
  daysInMonth?: number;        
  firstDayOfWeek?: number;     
  monthName?: string;         
}

const DEFAULT_DAYS_IN_MONTH = 31;
const DEFAULT_FIRST_DAY = 4;    
const DEFAULT_MONTH_NAME = 'May 2025';

function getCalendarWeeks(
  daysInMonth: number,
  firstDayOfWeek: number
): Record<number, number[]> {
  const slots: number[] = [];
  for (let i = 0; i < firstDayOfWeek; i++) slots.push(0);
  for (let d = 1; d <= daysInMonth; d++) slots.push(d);
  const rem = (7 - (slots.length % 7)) % 7;
  for (let i = 0; i < rem; i++) slots.push(0);

  const weeks: Record<number, number[]> = {};
  for (let i = 0; i < slots.length; i += 7) {
    weeks[i / 7 + 1] = slots.slice(i, i + 7);
  }
  return weeks;
}

function mostCommonMood(
  days: number[],
  entries: Record<number, DayEntry>
): Mood | null {
  const counts: Record<Mood, number> = { '😊': 0, '😐': 0, '😢': 0 };
  days.forEach(d => {
    if (d > 0 && entries[d].mood) {
      counts[entries[d].mood!] += 1;
    }
  });
  const total = counts['😊'] + counts['😐'] + counts['😢'];
  if (total === 0) return null;
  if (counts['😊'] >= counts['😐'] && counts['😊'] >= counts['😢']) return '😊';
  if (counts['😐'] >= counts['😢']) return '😐';
  return '😢';
}

const MoodPage: React.FC<MoodPageProps> = ({
  entries,
  daysInMonth = DEFAULT_DAYS_IN_MONTH,
  firstDayOfWeek = DEFAULT_FIRST_DAY,
  monthName = DEFAULT_MONTH_NAME,
}) => {
  const [mode, setMode] = useState<'weekly' | 'monthly' | null>(null);
  const [selected, setSelected] = useState<number | string | null>(null);

  const weeklySlots = useMemo(
    () => getCalendarWeeks(daysInMonth, firstDayOfWeek),
    [daysInMonth, firstDayOfWeek]
  );

  const weeklyGroups = useMemo(() => {
    const out: Record<number, number[]> = {};
    Object.entries(weeklySlots).forEach(([wk, slots]) => {
      if (slots.some(d => d > 0 && entries[d].mood)) {
        out[Number(wk)] = slots;
      }
    });
    return out;
  }, [weeklySlots, entries]);

  const monthlySlots = useMemo(() => {
    const slots: number[] = [];
    for (let i = 0; i < firstDayOfWeek; i++) slots.push(0);
    for (let d = 1; d <= daysInMonth; d++) slots.push(d);
    const rem = (7 - (slots.length % 7)) % 7;
    for (let i = 0; i < rem; i++) slots.push(0);
    return slots;
  }, [daysInMonth, firstDayOfWeek]);

  const monthlyGroups = useMemo(() => {
    if (monthlySlots.some(d => d > 0 && entries[d].mood)) {
      return { [monthName]: monthlySlots };
    }
    return {};
  }, [monthlySlots, entries, monthName]);

  if (mode === null) {
    return (
      <div className="mood-page">
        <h2>Average Mood</h2>
        <Link to="/" className="btn-back">← Back</Link>
        <button onClick={() => setMode('weekly')}>Weekly</button>
        <button onClick={() => setMode('monthly')}>Monthly</button>
      </div>
    );
  }

  const groups = mode === 'weekly' ? weeklyGroups : monthlyGroups;
  if (selected === null) {
    return (
      <div className="mood-dashboard">
        <h3>
          {mode === 'weekly' ? 'Weeks with entries' : 'Months with entries'}
        </h3>
        <ul>
          {Object.keys(groups).map(key => (
            <li key={key}>
              <button onClick={() => setSelected(key)}>
                {mode === 'weekly' ? `Week ${key}` : key}
              </button>
            </li>
          ))}
        </ul>
        <button className="btn-back" onClick={() => setMode(null)}>← Back</button>
      </div>
    );
  }

  const slotsOrDays = groups[selected as keyof typeof groups];
  const mood = mostCommonMood(slotsOrDays, entries);
  const label =
    mood === '😊' ? 'happy' : mood === '😢' ? 'sad' : 'neutral';

  return (
    <div className="mood-detail">
      <button className="btn-back" onClick={() => setSelected(null)}>← Back</button>
      <div className="mood-emoji" aria-hidden="true">{mood}</div>
      <p>
        Your most common mood for the{' '}
        {mode === 'weekly' ? 'week' : 'month'} was {label}.
      </p>
    </div>
  );
};

export default MoodPage;
