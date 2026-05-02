/**
 * Mapa de calor hora × día — reutilizable.
 * Props:
 *   rows     — [[hourLabel, mon, tue, wed, thu, fri], ...]
 *   dayLabels — etiquetas de columnas (default: Lun–Vie)
 */
const DEFAULT_DAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie'];

export default function Heatmap({ rows = [], dayLabels = DEFAULT_DAYS }) {
  const max = Math.max(...rows.flatMap((r) => r.slice(1)), 1);

  return (
    <div className="overflow-x-auto">
      <table className="text-[10px] text-text-hint border-collapse w-full">
        <thead>
          <tr>
            <th className="pr-3 pb-1 text-left font-normal">Hora</th>
            {dayLabels.map((d) => (
              <th key={d} className="px-2 pb-1 font-normal text-center">{d}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(([hour, ...vals]) => (
            <tr key={hour}>
              <td className="pr-3 py-0.5 text-text-hint whitespace-nowrap">{hour}</td>
              {vals.map((v, i) => (
                <td key={i} className="px-2 py-0.5">
                  <div
                    className="w-7 h-4 rounded-sm mx-auto"
                    title={`${v} alertas`}
                    style={{ background: `rgba(59,130,246,${(v / max) * 0.8 + 0.05})` }}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
