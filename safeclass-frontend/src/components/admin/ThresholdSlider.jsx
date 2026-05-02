/**
 * Control deslizante para el umbral de confianza de la IA.
 * Props:
 *   value     — número entre 0.5 y 0.95
 *   onChange  — cb(number)
 *   min / max / step — opcionales
 */
export default function ThresholdSlider({ value, onChange, min = 0.50, max = 0.95, step = 0.01 }) {
  return (
    <div className="bg-surface-card border border-[#1e2d4a] rounded-lg p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-text-secondary">Umbral actual</span>
        <span className="font-mono text-xl font-bold text-blue-400">{value.toFixed(2)}</span>
      </div>
      <input
        type="range"
        min={min} max={max} step={step}
        value={value}
        onChange={(e) => onChange?.(parseFloat(e.target.value))}
        className="w-full accent-blue-500"
      />
      <div className="flex justify-between text-[10px] text-text-hint mt-1">
        <span>{min.toFixed(2)} (más alertas)</span>
        <span>{max.toFixed(2)} (más preciso)</span>
      </div>
    </div>
  );
}
