import './Clay.css';

export function ClayCard({ children, style, className = '' }) {
  return <div className={`clay-card ${className}`} style={style}>{children}</div>;
}

export function ClayButton({ children, variant = 'default', className = '', ...props }) {
  const variantClass = variant === 'default' ? '' : `clay-button--${variant}`;
  return (
    <button className={`clay-button ${variantClass} ${className}`} {...props}>
      {children}
    </button>
  );
}

export function ClayInput(props) {
  return <input className="clay-input" {...props} />;
}

export function ClaySelect({ children, ...props }) {
  return (
    <select className="clay-select" {...props}>
      {children}
    </select>
  );
}

export function ClayTextarea(props) {
  return <textarea className="clay-textarea" {...props} />;
}

export function ClayField({ label, children }) {
  return (
    <div className="clay-field">
      {label && <label className="clay-label">{label}</label>}
      {children}
    </div>
  );
}

export function ClayChip({ children, selected, onClick }) {
  if (!onClick) {
    return <span className={`clay-chip ${selected ? 'clay-chip--selected' : ''}`}>{children}</span>;
  }
  return (
    <button
      type="button"
      className={`clay-chip-button clay-chip ${selected ? 'clay-chip--selected' : ''}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export function ClayModal({ children, onClose }) {
  return (
    <div className="clay-modal-overlay" onClick={onClose}>
      <div className="clay-modal" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

export function ClayEmpty({ children }) {
  return <div className="clay-empty">{children}</div>;
}

export function ClayError({ children }) {
  if (!children) return null;
  return <div className="clay-error">{children}</div>;
}
