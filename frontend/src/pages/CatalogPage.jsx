import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ClayCard, ClayButton, ClaySelect, ClayEmpty, ClayModal, ClayError } from '../components/common/Clay.jsx';
import ExerciseForm from '../components/exercises/ExerciseForm.jsx';
import { getExercises, createExercise } from '../api/exercises.js';
import { getSports } from '../api/sports.js';
import { getSubclassifications } from '../api/subclassifications.js';

export default function CatalogPage() {
  const [exercises, setExercises] = useState([]);
  const [sports, setSports] = useState([]);
  const [subclassifications, setSubclassifications] = useState([]);
  const [sportFilter, setSportFilter] = useState('');
  const [subFilter, setSubFilter] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [error, setError] = useState('');

  async function reload() {
    const [ex, sp, sub] = await Promise.all([
      getExercises({ sportId: sportFilter || undefined, subclassificationId: subFilter || undefined }),
      getSports(),
      getSubclassifications(),
    ]);
    setExercises(ex);
    setSports(sp);
    setSubclassifications(sub);
  }

  useEffect(() => {
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sportFilter, subFilter]);

  const filteredSubs = useMemo(
    () => subclassifications.filter((s) => !sportFilter || String(s.sport_id) === String(sportFilter)),
    [subclassifications, sportFilter]
  );

  async function handleCreate(payload) {
    await createExercise(payload);
    setShowCreate(false);
    await reload();
  }

  return (
    <div>
      <div className="page-header">
        <h1>Exercise Catalog</h1>
        <ClayButton variant="primary" onClick={() => setShowCreate(true)}>+ New exercise</ClayButton>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 18 }}>
        <ClaySelect
          style={{ maxWidth: 220 }}
          value={sportFilter}
          onChange={(e) => {
            setSportFilter(e.target.value);
            setSubFilter('');
          }}
        >
          <option value="">All sports</option>
          {sports.map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </ClaySelect>
        <ClaySelect style={{ maxWidth: 220 }} value={subFilter} onChange={(e) => setSubFilter(e.target.value)}>
          <option value="">All subclassifications</option>
          {filteredSubs.map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </ClaySelect>
      </div>

      <ClayError>{error}</ClayError>

      {exercises.length === 0 && <ClayEmpty>No exercises match these filters yet.</ClayEmpty>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
        {exercises.map((ex) => (
          <Link key={ex.id} to={`/exercises/${ex.id}`} style={{ textDecoration: 'none' }}>
            <ClayCard>
              {ex.photos[0] ? (
                <img
                  src={ex.photos[0].file_path}
                  alt={ex.name}
                  style={{ width: '100%', height: 130, objectFit: 'cover', borderRadius: 'var(--clay-radius-sm)', marginBottom: 10 }}
                />
              ) : (
                <div
                  style={{
                    width: '100%',
                    height: 130,
                    borderRadius: 'var(--clay-radius-sm)',
                    background: 'var(--clay-surface-alt)',
                    marginBottom: 10,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--clay-text-muted)',
                  }}
                >
                  No photo
                </div>
              )}
              <h3 style={{ margin: '0 0 4px' }}>{ex.name}</h3>
              <div style={{ color: 'var(--clay-text-muted)', fontSize: 13 }}>
                {ex.subclassifications.map((s) => s.name).join(', ') || 'No tags'}
              </div>
            </ClayCard>
          </Link>
        ))}
      </div>

      {showCreate && (
        <ClayModal onClose={() => setShowCreate(false)}>
          <h2>New exercise</h2>
          <ExerciseForm onSubmit={handleCreate} submitLabel="Create exercise" />
        </ClayModal>
      )}
    </div>
  );
}
