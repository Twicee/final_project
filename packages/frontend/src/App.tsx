import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

import LandingPage from './pages/LandingPage';
import type { DayEntry } from './pages/LandingPage';
import MoodPage from './pages/MoodPage';
import DeadlinesPage from './pages/DeadlinesPage';
import DarkModeToggle from './components/DarkModeToggle';
import ProfileButton from './components/ProfileButton';

const initialMock: Record<number, DayEntry> = {
  1: { mood: '😊', deadlines: [{ text: 'Submit report', completed: false }] },
  2: { mood: '😐', deadlines: [{ text: 'Team meeting at 3pm', completed: false }] },
  3: { mood: '😢', deadlines: [] },
};

const App: React.FC = () => {
  const [entries, setEntries] = useState<Record<number, DayEntry>>(() => {
    const base = {} as Record<number, DayEntry>;
    for (let i = 1; i <= 31; i++) {
      base[i] = initialMock[i] || { mood: null, deadlines: [] };
    }
    return base;
  });

  const handleSaveEntry = (day: number, updated: DayEntry) => {
    setEntries(prev => ({ ...prev, [day]: updated }));
  };

  return (
    <BrowserRouter>
      <header>
        <h1 className="logo">
          <Link to="/" className="logo-link">Chronolog</Link>
        </h1>
        <div className="header-controls">
          <ProfileButton />
          <DarkModeToggle />
        </div>
      </header>

      <Routes>
        <Route
          path="/"
          element={
            <LandingPage
              entries={entries}
              onSaveEntry={handleSaveEntry}
            />
          }
        />

        <Route
          path="/mood"
          element={<MoodPage entries={entries} />}
        />

        <Route
          path="/deadlines"
          element={<DeadlinesPage entries={entries} />}
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
