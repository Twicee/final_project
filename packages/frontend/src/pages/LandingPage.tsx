import React, { useState } from 'react';
import NavBar from '../components/NavBar';
import type { NavItem } from '../components/NavBar';
import CalendarGrid from '../components/CalendarGrid';
import PopUpModal from '../components/PopUpModal';

export type Mood = '😊' | '😐' | '😢';

export interface DeadlineItem {
  text: string;
  completed: boolean;
}
export interface DayEntry {
  mood: Mood | null;
  deadlines: DeadlineItem[];
}

interface LandingPageProps {
  entries: Record<number, DayEntry>;
  onSaveEntry: (day: number, updated: DayEntry) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ entries, onSaveEntry }) => {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const navItems: NavItem[] = [
    { path: '/mood', label: 'Average Mood' },
    { path: '/deadlines', label: 'View Deadlines' },
  ];

  const handleDayClick = (day: number) => setSelectedDay(day);
  const handleSave = (updated: DayEntry) => {
    if (selectedDay !== null) {
      onSaveEntry(selectedDay, updated);
      setSelectedDay(null);
    }
  };

  return (
    <div className="container">
      <main>
        <NavBar items={navItems} />

        <CalendarGrid
          monthName="May 2025"
          daysInMonth={31}
          firstDayOfWeek={4}
          entries={entries}
          onDayClick={handleDayClick}
        />

        {selectedDay !== null && (
          <PopUpModal
            day={selectedDay}
            entry={entries[selectedDay]}
            onSave={handleSave}
            onClose={() => setSelectedDay(null)}
          />
        )}
      </main>
    </div>
  );
};

export default LandingPage;
