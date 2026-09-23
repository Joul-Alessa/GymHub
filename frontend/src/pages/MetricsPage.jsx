import { useEffect, useState } from 'react';
import { ClayCard, ClayButton, ClayInput, ClayError, ClayEmpty, ClayChip } from '../components/common/Clay.jsx';
import { getMetrics, createMetric, updateMetric, createUnit, updateUnit } from '../api/metrics.js';

function UnitEditor({ unit, onSaved }) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(unit.name);
  const [abbreviation, setAbbreviation] = useState(unit.abbreviation);
  const [error, setError] = useState('');

  async function save() {
    setError('');
    try {
      await updateUnit(unit.id, name, abbreviation);
      setEditing(false);
      onSaved();
    } catch (e) {
      setError(e.message);
    }
  }

  if (!editing) {
    return <ClayChip onClick={() => setEditing(true)}>{unit.name} ({unit.abbreviation})</ClayChip>;
  }
  return (
    <span style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}>
      <ClayInput style={{ width: 100 }} value={name} onChange={(e) => setName(e.target.value)} />
      <ClayInput style={{ width: 70 }} value={abbreviation} onChange={(e) => setAbbreviation(e.target.value)} />
      <ClayButton variant="primary" onClick={save}>Save</ClayButton>
      <ClayButton variant="ghost" onClick={() => setEditing(false)}>Cancel</ClayButton>
      <ClayError>{error}</ClayError>
    </span>
  );
}

function MetricCard({ metric, onSaved }) {
  const [editingName, setEditingName] = useState(false);
  const [name, setName] = useState(metric.name);
  const [addingUnit, setAddingUnit] = useState(false);
  const [unitName, setUnitName] = useState('');
  const [unitAbbr, setUnitAbbr] = useState('');
  const [error, setError] = useState('');

  async function saveName() {
    setError('');
    try {
      await updateMetric(metric.id, name);
      setEditingName(false);
      onSaved();
    } catch (e) {
      setError(e.message);
    }
  }

  async function addUnit(e) {
    e.preventDefault();
    setError('');
    if (!unitName.trim() || !unitAbbr.trim()) return;
    try {
      await createUnit(metric.id, unitName.trim(), unitAbbr.trim());
      setUnitName('');
      setUnitAbbr('');
      setAddingUnit(false);
      onSaved();
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <ClayCard style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
        {!editingName ? (
          <>
            <h3 style={{ flex: 1, margin: 0 }}>{metric.name}</h3>
            <ClayButton variant="ghost" onClick={() => setEditingName(true)}>Rename</ClayButton>
          </>
        ) : (
          <>
            <ClayInput style={{ flex: 1 }} value={name} onChange={(e) => setName(e.target.value)} />
            <ClayButton variant="primary" onClick={saveName}>Save</ClayButton>
            <ClayButton variant="ghost" onClick={() => setEditingName(false)}>Cancel</ClayButton>
          </>
        )}
      </div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
        {metric.units.length === 0 && <ClayEmpty>No units yet.</ClayEmpty>}
        {metric.units.map((u) => (
          <UnitEditor key={u.id} unit={u} onSaved={onSaved} />
        ))}
        {!addingUnit ? (
          <ClayButton variant="ghost" onClick={() => setAddingUnit(true)}>+ Unit</ClayButton>
        ) : (
          <form onSubmit={addUnit} style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <ClayInput style={{ width: 100 }} placeholder="Name" value={unitName} onChange={(e) => setUnitName(e.target.value)} />
            <ClayInput style={{ width: 70 }} placeholder="abbr" value={unitAbbr} onChange={(e) => setUnitAbbr(e.target.value)} />
            <ClayButton type="submit" variant="primary">Add</ClayButton>
            <ClayButton type="button" variant="ghost" onClick={() => setAddingUnit(false)}>Cancel</ClayButton>
          </form>
        )}
      </div>
      <ClayError>{error}</ClayError>
    </ClayCard>
  );
}

export default function MetricsPage() {
  const [metrics, setMetrics] = useState([]);
  const [newMetricName, setNewMetricName] = useState('');
  const [error, setError] = useState('');

  async function reload() {
    setMetrics(await getMetrics());
  }

  useEffect(() => {
    reload();
  }, []);

  async function handleAddMetric(e) {
    e.preventDefault();
    setError('');
    if (!newMetricName.trim()) return;
    try {
      await createMetric(newMetricName.trim());
      setNewMetricName('');
      await reload();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div>
      <div className="page-header">
        <h1>Metrics Catalog</h1>
      </div>
      <ClayError>{error}</ClayError>
      <ClayCard style={{ marginBottom: 20 }}>
        <form onSubmit={handleAddMetric} style={{ display: 'flex', gap: 10 }}>
          <ClayInput
            placeholder="New metric name (e.g. Ball Control Score)"
            value={newMetricName}
            onChange={(e) => setNewMetricName(e.target.value)}
            style={{ flex: 1 }}
          />
          <ClayButton type="submit" variant="primary">Add metric</ClayButton>
        </form>
      </ClayCard>
      {metrics.length === 0 && <ClayEmpty>No metrics yet.</ClayEmpty>}
      {metrics.map((m) => (
        <MetricCard key={m.id} metric={m} onSaved={reload} />
      ))}
    </div>
  );
}
