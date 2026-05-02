import Icon from '@/components/ui/Icon';

/**
 * Tarjeta de indicador clave (KPI) — reutilizable en Dashboard y Coordinator.
 * Props:
 *   label  — texto descriptivo
 *   value  — valor principal (string o número)
 *   icon   — nombre del icono
 *   color  — color del icono y acento (hex)
 */
export default function KPICard({ label, value, icon, color = '#3b82f6' }) {
  return (
    <div className="bg-surface-card border border-[#1e2d4a] rounded-lg p-3">
      <div className="flex items-center gap-2 mb-2">
        <span style={{ color }}><Icon name={icon} size={14} /></span>
        <span className="text-[11px] text-text-hint">{label}</span>
      </div>
      <div className="text-2xl font-bold text-text-primary font-mono truncate">{value}</div>
    </div>
  );
}
