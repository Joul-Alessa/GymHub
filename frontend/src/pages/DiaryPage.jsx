import { useEffect, useState } from 'react';
import { ClayCard, ClayButton, ClayInput, ClayEmpty, ClayError } from '../components/common/Clay.jsx';
import EntryForm from '../components/diary/EntryForm.jsx';
import { getSessions, createSession, addEntry, deleteEntry } from '../api/trainingSessions.js';

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

export default function DiaryPage() {
  const [date, setDate] = useState(todayIso());
  const [session, setSession] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function loadForDate(d) {
    setLoading(true);
    setError('');
    try {
      const sessions = await getSessions(d, d);
      setSession(sessions[0] || null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadForDate(date);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date]);

  async function handleCreateSession() {
    setError('');
    try {
      const created = await createSession(date, '');
      setSession(created);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleAddEntry(payload) {
    if (!session) return;
    await addEntry(session.id, payload);
    await loadForDate(date);
  }

  async function handleDeleteEntry(entryId) {
    if (!session) return;
    await deleteEntry(session.id, entryId);
    await loadForDate(date);
  }

  return (
    <div>
      <div className="page-header">
        <h1>Training Diary</h1>
        <ClayInput type="date" value={date} onChange={(e) => setDate(e.target.value)} style={{ maxWidth: 180 }} />
      </div>

      <ClayError>{error}</ClayError>

      {loading ? (
        <ClayEmpty>Loading...</ClayEmpty>
      ) : !session ? (
        <ClayCard>
          <p>No session recorded for {date} yet.</p>
          <ClayButton variant="primary" onClick={handleCreateSession}>Start session</ClayButton>
        </ClayCard>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <ClayCard>
            <h3>Log a set</h3>
            <EntryForm onSubmit={handleAddEntry} />
          </ClayCard>

          <ClayCard>
            <h3>Sets logged today ({session.entries.length})</h3>
            {session.entries.length === 0 && <ClayEmpty>No sets yet — log your first one.</ClayEmpty>}
            {session.entries.map((entry) => (
              <div key={entry.id} style={{ borderBottom: '1px solid var(--clay-surface-alt)', padding: '10px 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong>{entry.exercise_name}</strong>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <span className="clay-badge">Diff {entry.difficulty}/5</span>
                    <ClayButton variant="ghost" onClick={() => handleDeleteEntry(entry.id)}>Delete</ClayButton>
                  </div>
                </div>
                <div style={{ color: 'var(--clay-text-muted)', fontSize: 13 }}>
                  {entry.metrics.map((m) => `${m.metric_name}: ${m.value}${m.unit_abbreviation ? ` ${m.unit_abbreviation}` : ''}`).join(' · ')}
                </div>
                {entry.notes && <div style={{ fontSize: 13, marginTop: 4 }}>{entry.notes}</div>}
              </div>
            ))}
          </ClayCard>
        </div>
      )}
    </div>
  );
}
