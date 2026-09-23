import { useEffect, useState } from 'react';
import { ClayCard, ClayEmpty } from '../components/common/Clay.jsx';
import ActivityHeatmap from '../components/charts/ActivityHeatmap.jsx';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getHeatmap, getGlobalActivity } from '../api/stats.js';

export default function StatsPage() {
  const [heatmap, setHeatmap] = useState(null);
  const [activity, setActivity] = useState(null);

  useEffect(() => {
    getHeatmap().then(setHeatmap);
    getGlobalActivity().then(setActivity);
  }, []);

  const recentActivity = activity?.days.slice(-30) || [];

  return (
    <div>
      <div className="page-header">
        <h1>Training Stats</h1>
      </div>

      <ClayCard style={{ marginBottom: 20 }}>
        <h3>Activity heatmap (last year)</h3>
        {heatmap ? <ActivityHeatmap from={heatmap.from} to={heatmap.to} days={heatmap.days} /> : <ClayEmpty>Loading...</ClayEmpty>}
      </ClayCard>

      <ClayCard>
        <h3>Sets logged per day (last 30 days)</h3>
        {recentActivity.length === 0 ? (
          <ClayEmpty>No training activity yet.</ClayEmpty>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={recentActivity} margin={{ top: 10, right: 20, bottom: 10, left: 0 }}>
              <CartesianGrid stroke="var(--clay-shadow-dark)" strokeDasharray="4 4" />
              <XAxis dataKey="date" stroke="var(--clay-text-muted)" fontSize={11} />
              <YAxis stroke="var(--clay-text-muted)" fontSize={12} allowDecimals={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: 'var(--clay-shadow-soft)' }} />
              <Bar dataKey="entry_count" fill="var(--clay-accent)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </ClayCard>
    </div>
  );
}
