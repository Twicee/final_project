import React from 'react';
import { useDarkMode } from '../hooks/useDarkMode';

const DarkModeToggle: React.FC = () => {
  const [theme, toggleTheme] = useDarkMode();

  return (
    <button
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      aria-pressed={theme === 'dark'}
      className="dark-mode-toggle"
    >
      {theme === 'dark' ? '🌞' : '🌚'}
    </button>
  );
};

export default DarkModeToggle;
