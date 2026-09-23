import { useEffect, useMemo, useState } from 'react';
import { ClayField, ClaySelect, ClayInput, ClayTextarea, ClayButton, ClayError } from '../common/Clay.jsx';
import { getExercises } from '../../api/exercises.js';
import { getMetrics } from '../../api/metrics.js';

const DIFFICULTY_LABELS = {
  1: '1 - Very difficult',
  2: '2',
  3: '3 - Moderate',
  4: '4',
  5: '5 - Very easy',
};

export default function EntryForm({ onSubmit }) {
  const [exercises, setExercises] = useState([]);
  const [metrics, setMetrics] = useState([]);
  const [exerciseId, setExerciseId] = useState('');
  const [difficulty, setDifficulty] = useState('3');
  const [notes, setNotes] = useState('');
  const [metricRows, setMetricRows] = useState([]);
  const [newMetricId, setNewMetricId] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([getExercises(), getMetrics()]).then(([ex, m]) => {
      setExercises(ex);
      setMetrics(m);
    });
  }, []);

  const selectedExercise = useMemo(() => exercises.find((e) => String(e.id) === String(exerciseId)), [exercises, exerciseId]);

  useEffect(() => {
    if (!selectedExercise) {
      setMetricRows([]);
      return;
    }
    setMetricRows(
      selectedExercise.commonMetrics.map((cm) => ({
        metricId: cm.metric_id,
        metricName: cm.metric_name,
        unitId: cm.default_unit_id || '',
        value: '',
      }))
    );
  }, [selectedExercise]);

  function metricUnits(metricId) {
    return metrics.find((m) => m.id === metricId)?.units || [];
  }

  function updateRow(metricId, field, value) {
    setMetricRows((prev) => prev.map((r) => (r.metricId === metricId ? { ...r, [field]: value } : r)));
  }

  function removeRow(metricId) {
    setMetricRows((prev) => prev.filter((r) => r.metricId !== metricId));
  }

  function addMetricRow() {
    if (!newMetricId) return;
    const id = Number(newMetricId);
    if (metricRows.some((r) => r.metricId === id)) return;
    const metric = metrics.find((m) => m.id === id);
    setMetricRows((prev) => [...prev, { metricId: id, metricName: metric.name, unitId: '', value: '' }]);
    setNewMetricId('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!exerciseId) {
      setError('Select an exercise');
      return;
    }
    const preparedMetrics = metricRows
      .filter((r) => r.value !== '')
      .map((r) => ({ metricId: r.metricId, unitId: r.unitId ? Number(r.unitId) : null, value: Number(r.value) }));

    setSaving(true);
    try {
      await onSubmit({
        exerciseId: Number(exerciseId),
        difficulty: Number(difficulty),
        notes: notes.trim(),
        metrics: preparedMetrics,
      });
      setNotes('');
      setMetricRows((prev) => prev.map((r) => ({ ...r, value: '' })));
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  const availableMetrics = metrics.filter((m) => !metricRows.some((r) => r.metricId === m.id));

  return (
    <form onSubmit={handleSubmit}>
      <ClayField label="Exercise">
        <ClaySelect value={exerciseId} onChange={(e) => setExerciseId(e.target.value)}>
          <option value="">Select exercise...</option>
          {exercises.map((ex) => (
            <option key={ex.id} value={ex.id}>{ex.name}</option>
          ))}
        </ClaySelect>
      </ClayField>

      {metricRows.map((row) => (
        <ClayField key={row.metricId} label={row.metricName}>
          <div style={{ display: 'flex', gap: 8 }}>
            <ClayInput
              type="number"
              step="any"
              placeholder="value"
              value={row.value}
              onChange={(e) => updateRow(row.metricId, 'value', e.target.value)}
              style={{ flex: 1 }}
            />
            {metricUnits(row.metricId).length > 0 && (
              <ClaySelect
                style={{ maxWidth: 160 }}
                value={row.unitId}
                onChange={(e) => updateRow(row.metricId, 'unitId', e.target.value)}
              >
                <option value="">unit...</option>
                {metricUnits(row.metricId).map((u) => (
                  <option key={u.id} value={u.id}>{u.abbreviation}</option>
                ))}
              </ClaySelect>
            )}
            <ClayButton type="button" variant="ghost" onClick={() => removeRow(row.metricId)}>Remove</ClayButton>
          </div>
        </ClayField>
      ))}

      {exerciseId && (
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          <ClaySelect style={{ maxWidth: 220 }} value={newMetricId} onChange={(e) => setNewMetricId(e.target.value)}>
            <option value="">Log another metric...</option>
            {availableMetrics.map((m) => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </ClaySelect>
          <ClayButton type="button" onClick={addMetricRow}>Add metric</ClayButton>
        </div>
      )}

      <ClayField label="Difficulty (1 = very difficult, 5 = very easy)">
        <ClaySelect value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
          {Object.entries(DIFFICULTY_LABELS).map(([val, label]) => (
            <option key={val} value={val}>{label}</option>
          ))}
        </ClaySelect>
      </ClayField>

      <ClayField label="Notes (optional)">
        <ClayTextarea value={notes} onChange={(e) => setNotes(e.target.value)} />
      </ClayField>

      <ClayError>{error}</ClayError>
      <ClayButton type="submit" variant="primary" disabled={saving}>
        {saving ? 'Logging...' : 'Log set'}
      </ClayButton>
    </form>
  );
}
