import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ClayCard,
  ClayButton,
  ClaySelect,
  ClayModal,
  ClayEmpty,
  ClayError,
} from '../components/common/Clay.jsx';
import ExerciseForm from '../components/exercises/ExerciseForm.jsx';
import ProgressLineChart from '../components/charts/ProgressLineChart.jsx';
import {
  getExercise,
  updateExercise,
  deleteExercise,
  uploadExercisePhoto,
  deleteExercisePhoto,
  getExerciseHistory,
  getExerciseProgress,
} from '../api/exercises.js';

export default function ExerciseDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [exercise, setExercise] = useState(null);
  const [history, setHistory] = useState([]);
  const [progressMetricId, setProgressMetricId] = useState('');
  const [progressData, setProgressData] = useState([]);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState('');

  async function reload() {
    const ex = await getExercise(id);
    setExercise(ex);
    setHistory(await getExerciseHistory(id, 15));
    if (ex.commonMetrics.length && !progressMetricId) {
      setProgressMetricId(String(ex.commonMetrics[0].metric_id));
    }
  }

  useEffect(() => {
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (!progressMetricId) return;
    getExerciseProgress(id, progressMetricId).then(setProgressData);
  }, [id, progressMetricId]);

  async function handlePhotoUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    setError('');
    try {
      await uploadExercisePhoto(id, file);
      await reload();
    } catch (err) {
      setError(err.message);
    } finally {
      e.target.value = '';
    }
  }

  async function handlePhotoDelete(photoId) {
    await deleteExercisePhoto(id, photoId);
    await reload();
  }

  async function handleUpdate(payload) {
    await updateExercise(id, payload);
    setEditing(false);
    await reload();
  }

  async function handleDelete() {
    if (!window.confirm('Delete this exercise? This cannot be undone.')) return;
    setError('');
    try {
      await deleteExercise(id);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  }

  if (!exercise) return <ClayEmpty>Loading...</ClayEmpty>;

  return (
    <div>
      <div className="page-header">
        <h1>{exercise.name}</h1>
        <div style={{ display: 'flex', gap: 10 }}>
          <ClayButton onClick={() => setEditing(true)}>Edit</ClayButton>
          <ClayButton variant="danger" onClick={handleDelete}>Delete</ClayButton>
        </div>
      </div>

      <ClayError>{error}</ClayError>

      <ClayCard style={{ marginBottom: 20 }}>
        <p>{exercise.description || <em style={{ color: 'var(--clay-text-muted)' }}>No description.</em>}</p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
          {exercise.subclassifications.map((s) => (
            <span key={s.id} className="clay-chip">{s.name}</span>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 12 }}>
          {exercise.photos.map((p) => (
            <div key={p.id} style={{ position: 'relative' }}>
              <img
                src={p.file_path}
                alt={exercise.name}
                style={{ width: 140, height: 140, objectFit: 'cover', borderRadius: 'var(--clay-radius-sm)', boxShadow: 'var(--clay-shadow-soft)' }}
              />
              <button
                onClick={() => handlePhotoDelete(p.id)}
                style={{
                  position: 'absolute', top: 6, right: 6, border: 'none', borderRadius: '50%',
                  width: 24, height: 24, background: 'var(--clay-danger)', color: '#fff', cursor: 'pointer',
                }}
                title="Remove photo"
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <label className="clay-button">
          + Add photo
          <input type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display: 'none' }} />
        </label>
      </ClayCard>

      <ClayCard style={{ marginBottom: 20 }}>
        <div className="page-header">
          <h3 style={{ margin: 0 }}>Progress</h3>
          {exercise.commonMetrics.length > 0 && (
            <ClaySelect style={{ maxWidth: 220 }} value={progressMetricId} onChange={(e) => setProgressMetricId(e.target.value)}>
              {exercise.commonMetrics.map((m) => (
                <option key={m.metric_id} value={m.metric_id}>{m.metric_name}</option>
              ))}
            </ClaySelect>
          )}
        </div>
        {progressData.length === 0 ? (
          <ClayEmpty>No logged data yet for this metric.</ClayEmpty>
        ) : (
          <ProgressLineChart data={progressData} unitLabel={progressData[0]?.unit_abbreviation} />
        )}
      </ClayCard>

      <ClayCard>
        <h3>Recent history</h3>
        {history.length === 0 && <ClayEmpty>No sets logged yet.</ClayEmpty>}
        {history.map((entry) => (
          <div key={entry.id} style={{ borderBottom: '1px solid var(--clay-surface-alt)', padding: '10px 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
              <span>{entry.session_date}</span>
              <span>Difficulty {entry.difficulty}/5</span>
            </div>
            <div style={{ color: 'var(--clay-text-muted)', fontSize: 13 }}>
              {entry.metrics.map((m) => `${m.metric_name}: ${m.value}${m.unit_abbreviation ? ` ${m.unit_abbreviation}` : ''}`).join(' · ')}
            </div>
            {entry.notes && <div style={{ fontSize: 13, marginTop: 4 }}>{entry.notes}</div>}
          </div>
        ))}
      </ClayCard>

      {editing && (
        <ClayModal onClose={() => setEditing(false)}>
          <h2>Edit exercise</h2>
          <ExerciseForm initial={exercise} onSubmit={handleUpdate} submitLabel="Save changes" />
        </ClayModal>
      )}
    </div>
  );
}
