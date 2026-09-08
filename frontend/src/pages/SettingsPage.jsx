import { useEffect, useState } from 'react';
import { ClayCard, ClayButton, ClayInput, ClayField, ClayError, ClayEmpty } from '../components/common/Clay.jsx';
import { getSports, createSport, updateSport } from '../api/sports.js';
import { getSubclassifications, createSubclassification, updateSubclassification } from '../api/subclassifications.js';

function SportRow({ sport, onSaved }) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(sport.name);
  const [error, setError] = useState('');

  async function save() {
    setError('');
    try {
      await updateSport(sport.id, name);
      setEditing(false);
      onSaved();
    } catch (e) {
      setError(e.message);
    }
  }

  if (!editing) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0' }}>
        <strong style={{ flex: 1 }}>{sport.name}</strong>
        <ClayButton variant="ghost" onClick={() => setEditing(true)}>Edit</ClayButton>
      </div>
    );
  }
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0' }}>
      <ClayInput value={name} onChange={(e) => setName(e.target.value)} style={{ flex: 1 }} />
      <ClayButton variant="primary" onClick={save}>Save</ClayButton>
      <ClayButton variant="ghost" onClick={() => setEditing(false)}>Cancel</ClayButton>
      <ClayError>{error}</ClayError>
    </div>
  );
}

function SubclassRow({ sub, onSaved }) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(sub.name);
  const [error, setError] = useState('');

  async function save() {
    setError('');
    try {
      await updateSubclassification(sub.id, name);
      setEditing(false);
      onSaved();
    } catch (e) {
      setError(e.message);
    }
  }

  if (!editing) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0' }}>
        <span style={{ flex: 1 }}>{sub.name}</span>
        <ClayButton variant="ghost" onClick={() => setEditing(true)}>Edit</ClayButton>
      </div>
    );
  }
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0' }}>
      <ClayInput value={name} onChange={(e) => setName(e.target.value)} style={{ flex: 1 }} />
      <ClayButton variant="primary" onClick={save}>Save</ClayButton>
      <ClayButton variant="ghost" onClick={() => setEditing(false)}>Cancel</ClayButton>
      <ClayError>{error}</ClayError>
    </div>
  );
}

export default function SettingsPage() {
  const [sports, setSports] = useState([]);
  const [subclassifications, setSubclassifications] = useState([]);
  const [newSportName, setNewSportName] = useState('');
  const [newSubName, setNewSubName] = useState('');
  const [newSubSportId, setNewSubSportId] = useState('');
  const [error, setError] = useState('');

  async function reload() {
    const [sportsData, subsData] = await Promise.all([getSports(), getSubclassifications()]);
    setSports(sportsData);
    setSubclassifications(subsData);
    if (!newSubSportId && sportsData.length) setNewSubSportId(String(sportsData[0].id));
  }

  useEffect(() => {
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleAddSport(e) {
    e.preventDefault();
    setError('');
    if (!newSportName.trim()) return;
    try {
      await createSport(newSportName.trim());
      setNewSportName('');
      await reload();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleAddSub(e) {
    e.preventDefault();
    setError('');
    if (!newSubName.trim() || !newSubSportId) return;
    try {
      await createSubclassification(Number(newSubSportId), newSubName.trim());
      setNewSubName('');
      await reload();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div>
      <div className="page-header">
        <h1>Sports & Subclassifications</h1>
      </div>
      <ClayError>{error}</ClayError>

      <ClayCard style={{ marginBottom: 20 }}>
        <h3>Sports</h3>
        {sports.length === 0 && <ClayEmpty>No sports yet.</ClayEmpty>}
        {sports.map((s) => (
          <SportRow key={s.id} sport={s} onSaved={reload} />
        ))}
        <form onSubmit={handleAddSport} style={{ display: 'flex', gap: 10, marginTop: 16 }}>
          <ClayInput
            placeholder="New sport name"
            value={newSportName}
            onChange={(e) => setNewSportName(e.target.value)}
            style={{ flex: 1 }}
          />
          <ClayButton type="submit" variant="primary">Add sport</ClayButton>
        </form>
      </ClayCard>

      <ClayCard>
        <h3>Subclassifications</h3>
        {sports.map((sport) => (
          <div key={sport.id} style={{ marginBottom: 18 }}>
            <div style={{ fontWeight: 800, marginBottom: 6 }}>{sport.name}</div>
            {subclassifications.filter((s) => s.sport_id === sport.id).length === 0 && (
              <ClayEmpty>No subclassifications yet.</ClayEmpty>
            )}
            {subclassifications
              .filter((s) => s.sport_id === sport.id)
              .map((sub) => (
                <SubclassRow key={sub.id} sub={sub} onSaved={reload} />
              ))}
          </div>
        ))}
        <form onSubmit={handleAddSub} style={{ display: 'flex', gap: 10, marginTop: 12 }}>
          <select
            className="clay-select"
            value={newSubSportId}
            onChange={(e) => setNewSubSportId(e.target.value)}
            style={{ maxWidth: 200 }}
          >
            {sports.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
          <ClayInput
            placeholder="New subclassification"
            value={newSubName}
            onChange={(e) => setNewSubName(e.target.value)}
            style={{ flex: 1 }}
          />
          <ClayButton type="submit" variant="primary">Add</ClayButton>
        </form>
      </ClayCard>
    </div>
  );
}
