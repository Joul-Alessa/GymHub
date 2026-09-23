import { useEffect, useMemo, useState } from 'react';
import {
  ClayField,
  ClayInput,
  ClaySelect,
  ClayTextarea,
  ClayButton,
  ClayChip,
  ClayError,
} from '../common/Clay.jsx';
import { getSports } from '../../api/sports.js';
import { getSubclassifications } from '../../api/subclassifications.js';
import { getMetrics } from '../../api/metrics.js';

export default function ExerciseForm({ initial, onSubmit, submitLabel = 'Save exercise' }) {
  const [sports, setSports] = useState([]);
  const [subclassifications, setSubclassifications] = useState([]);
  const [metrics, setMetrics] = useState([]);

  const [name, setName] = useState(initial?.name || '');
  const [description, setDescription] = useState(initial?.description || '');
  const [sportId, setSportId] = useState(initial?.sport_id ? String(initial.sport_id) : '');
  const [subIds, setSubIds] = useState(
    new Set((initial?.subclassifications || []).map((s) => s.id))
  );
  const [commonMetrics, setCommonMetrics] = useState(
    (initial?.commonMetrics || []).map((cm) => ({
      metricId: cm.metric_id,
      defaultUnitId: cm.default_unit_id || '',
    }))
  );
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const [sportsData, subsData, metricsData] = await Promise.all([
        getSports(),
        getSubclassifications(),
        getMetrics(),
      ]);
      setSports(sportsData);
      setSubclassifications(subsData);
      setMetrics(metricsData);
      if (!sportId && sportsData.length) setSportId(String(sportsData[0].id));
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sportSubclassifications = useMemo(
    () => subclassifications.filter((s) => String(s.sport_id) === String(sportId)),
    [subclassifications, sportId]
  );

  function toggleSub(id) {
    setSubIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleMetric(metricId) {
    setCommonMetrics((prev) => {
      const exists = prev.find((m) => m.metricId === metricId);
      if (exists) return prev.filter((m) => m.metricId !== metricId);
      return [...prev, { metricId, defaultUnitId: '' }];
    });
  }

  function setMetricUnit(metricId, unitId) {
    setCommonMetrics((prev) => prev.map((m) => (m.metricId === metricId ? { ...m, defaultUnitId: unitId } : m)));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!name.trim()) {
      setError('Name is required');
      return;
    }
    if (!sportId) {
      setError('Sport is required');
      return;
    }
    setSaving(true);
    try {
      await onSubmit({
        name: name.trim(),
        description: description.trim(),
        sportId: Number(sportId),
        subclassificationIds: [...subIds],
        commonMetrics: commonMetrics.map((m) => ({
          metricId: m.metricId,
          defaultUnitId: m.defaultUnitId ? Number(m.defaultUnitId) : null,
        })),
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <ClayField label="Name">
        <ClayInput value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Concentration Curl" />
      </ClayField>

      <ClayField label="Description">
        <ClayTextarea value={description} onChange={(e) => setDescription(e.target.value)} />
      </ClayField>

      <ClayField label="Sport">
        <ClaySelect
          value={sportId}
          onChange={(e) => {
            setSportId(e.target.value);
            setSubIds(new Set());
          }}
        >
          {sports.map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </ClaySelect>
      </ClayField>

      <ClayField label="Subclassifications">
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {sportSubclassifications.length === 0 && <span style={{ color: 'var(--clay-text-muted)' }}>No subclassifications for this sport yet.</span>}
          {sportSubclassifications.map((s) => (
            <ClayChip key={s.id} selected={subIds.has(s.id)} onClick={() => toggleSub(s.id)}>
              {s.name}
            </ClayChip>
          ))}
        </div>
      </ClayField>

      <ClayField label="Common metrics (for quick logging)">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {metrics.map((m) => {
            const selected = commonMetrics.find((cm) => cm.metricId === m.id);
            return (
              <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <ClayChip selected={!!selected} onClick={() => toggleMetric(m.id)}>
                  {m.name}
                </ClayChip>
                {selected && m.units.length > 0 && (
                  <ClaySelect
                    style={{ maxWidth: 180 }}
                    value={selected.defaultUnitId}
                    onChange={(e) => setMetricUnit(m.id, e.target.value)}
                  >
                    <option value="">Default unit...</option>
                    {m.units.map((u) => (
                      <option key={u.id} value={u.id}>{u.name} ({u.abbreviation})</option>
                    ))}
                  </ClaySelect>
                )}
              </div>
            );
          })}
        </div>
      </ClayField>

      <ClayError>{error}</ClayError>
      <ClayButton type="submit" variant="primary" disabled={saving}>
        {saving ? 'Saving...' : submitLabel}
      </ClayButton>
    </form>
  );
}
