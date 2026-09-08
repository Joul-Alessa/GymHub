import './ActivityHeatmap.css';

const LEVEL_COLORS = ['#e3e8f0', '#c7e8d5', '#8fd6ac', '#5cc086', '#2ea862'];

function levelFor(count, max) {
  if (count <= 0) return 0;
  if (max <= 1) return count > 0 ? 2 : 0;
  const ratio = count / max;
  if (ratio > 0.75) return 4;
  if (ratio > 0.5) return 3;
  if (ratio > 0.25) return 2;
  return 1;
}

export default function ActivityHeatmap({ from, to, days }) {
  const countByDate = new Map(days.map((d) => [d.date, d.entry_count]));
  const max = Math.max(0, ...days.map((d) => d.entry_count));

  const start = new Date(`${from}T00:00:00`);
  const end = new Date(`${to}T00:00:00`);
  start.setDate(start.getDate() - start.getDay());

  const cells = [];
  const cursor = new Date(start);
  while (cursor <= end) {
    const iso = cursor.toISOString().slice(0, 10);
    const inRange = iso >= from && iso <= to;
    cells.push({ date: iso, count: inRange ? countByDate.get(iso) || 0 : null });
    cursor.setDate(cursor.getDate() + 1);
  }

  return (
    <div>
      <div className="heatmap-wrapper">
        <div className="heatmap-grid">
          {cells.map((cell) => (
            <div
              key={cell.date}
              className="heatmap-cell"
              title={cell.count === null ? '' : `${cell.date}: ${cell.count} set${cell.count === 1 ? '' : 's'}`}
              style={{
                background: cell.count === null ? 'transparent' : LEVEL_COLORS[levelFor(cell.count, max)],
              }}
            />
          ))}
        </div>
      </div>
      <div className="heatmap-legend">
        <span>Less</span>
        {LEVEL_COLORS.map((c) => (
          <span key={c} className="heatmap-cell" style={{ background: c }} />
        ))}
        <span>More</span>
      </div>
    </div>
  );
}
