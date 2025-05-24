import React, { useState, useId, useEffect } from 'react';
import type { DayEntry, DeadlineItem, Mood } from '../pages/LandingPage';

export interface PopUpModalProps {
  day: number;
  entry: DayEntry;
  onSave: (updated: DayEntry) => void;
  onClose: () => void;
}

const PopUpModal: React.FC<PopUpModalProps> = ({ day, entry, onSave, onClose }) => {
  const modalLabelId = useId();
  const [mood, setMood] = useState<Mood>(entry.mood || '😊');
  const [items, setItems] = useState<DeadlineItem[]>(
    entry.deadlines.map(d => ({ text: d.text, completed: d.completed }))
  );
  const [newText, setNewText] = useState('');

  useEffect(() => {
    const el = document.getElementById(`${modalLabelId}-new-deadline`);
    el?.focus();
  }, [modalLabelId]);

  const handleAdd = () => {
    const trimmed = newText.trim();
    if (trimmed) {
      setItems(prev => [...prev, { text: trimmed, completed: false }]);
      setNewText('');
    }
  };

  const toggleComplete = (idx: number) => {
    setItems(prev =>
      prev.map((item, i) => i === idx ? { ...item, completed: !item.completed } : item)
    );
  };

  const handleRemove = (idx: number) => {
    setItems(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSave = () => {
    onSave({ mood, deadlines: items });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-labelledby={modalLabelId}
        onClick={e => e.stopPropagation()}
      >
        <h2 id={modalLabelId}>Log Entry for {day}</h2>
        <form onSubmit={e => { e.preventDefault(); handleAdd(); }}>
          <fieldset>
            <legend>Mood *</legend>
            {(['😊', '😐', '😢'] as Mood[]).map(m => (
              <label key={m} htmlFor={`${modalLabelId}-mood-${m}`} style={{ marginRight: '1rem' }}>
                <input
                  type="radio"
                  id={`${modalLabelId}-mood-${m}`} 
                  name="mood"
                  value={m}
                  checked={mood === m}
                  onChange={() => setMood(m)}
                />{' '}
                <span aria-hidden="true">{m}</span>
                <span className="visually-hidden">
                  {m === '😊' ? 'Happy' : m === '😐' ? 'Neutral' : 'Sad'}
                </span>
              </label>
            ))}
          </fieldset>

          <div style={{ marginTop: '1rem' }}>
            <label htmlFor={`${modalLabelId}-new-deadline`}>Add Deadline</label>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
              <input
                type="text"
                id={`${modalLabelId}-new-deadline`}
                value={newText}
                onChange={e => setNewText(e.target.value)}
                placeholder="e.g., Submit report by 5pm"
                style={{ flexGrow: 1, padding: '0.5rem', fontSize: '1rem' }}
              />
              <button type="button" className="btn" onClick={handleAdd} style={{ whiteSpace: 'nowrap' }}>
                Add
              </button>
            </div>
          </div>

          <div style={{ marginTop: '1.5rem' }}>
            <h3>Deadlines</h3>
            {items.length ? (
              <ul style={{ maxHeight: '8rem', overflowY: 'auto', listStyle: 'none', padding: 0 }}>
                {items.map((item, idx) => (
                  <li key={idx} style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <input
                      type="checkbox"
                      checked={item.completed}
                      onChange={() => toggleComplete(idx)}
                      id={`${modalLabelId}-check-${idx}`}
                    />
                    <label
                      htmlFor={`${modalLabelId}-check-${idx}`}
                      style={{
                        marginLeft: '0.5rem',
                        textDecoration: item.completed ? 'line-through' : 'none',
                        flexGrow: 1
                      }}
                    >
                      {item.text}
                    </label>
                    <button
                      type="button"
                      onClick={() => handleRemove(idx)}
                      aria-label={`Remove ${item.text}`}
                      style={{ marginLeft: '0.5rem', background: 'none', border: 'none', cursor: 'pointer' }}
                    >
                      🗑️
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p>None</p>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
            <button type="button" className="btn" onClick={onClose}>
              Cancel
            </button>
            <button type="button" className="btn-submit" onClick={handleSave}>
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PopUpModal;
