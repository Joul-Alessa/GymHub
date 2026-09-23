import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function ProgressLineChart({ data, unitLabel }) {
  const chartData = data.map((d) => ({ date: d.session_date, value: d.value }));
  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={chartData} margin={{ top: 10, right: 20, bottom: 10, left: 0 }}>
        <CartesianGrid stroke="var(--clay-shadow-dark)" strokeDasharray="4 4" />
        <XAxis dataKey="date" stroke="var(--clay-text-muted)" fontSize={12} />
        <YAxis stroke="var(--clay-text-muted)" fontSize={12} label={unitLabel ? { value: unitLabel, angle: -90, position: 'insideLeft' } : undefined} />
        <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: 'var(--clay-shadow-soft)' }} />
        <Line type="monotone" dataKey="value" stroke="var(--clay-primary)" strokeWidth={3} dot={{ r: 4 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}
