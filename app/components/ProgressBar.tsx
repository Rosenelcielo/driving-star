type ProgressBarProps = {
  value: number;
  max?: number;
  label?: string;
};

export function ProgressBar({ value, max = 100, label }: ProgressBarProps) {
  const safeMax = Math.max(max, 1);
  const safeValue = Math.min(Math.max(value, 0), safeMax);
  const percent = Math.round((safeValue / safeMax) * 100);

  return (
    <div className="game-progress">
      {label ? (
        <div className="game-progress__header">
          <span>{label}</span>
          <span>{percent}%</span>
        </div>
      ) : null}
      <div role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={safeMax} aria-valuenow={safeValue} className="game-progress__track">
        <div className="game-progress__fill" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
