import { useState, useMemo } from 'react';
import AlertDetail from '@/components/alerts/AlertDetail';
import { AlertTypeBadge, StatusBadge } from '@/components/ui/Badge';
import ConfidenceBar from '@/components/ui/ConfidenceBar';
import Icon from '@/components/ui/Icon';
import { useAlerts } from '@/hooks/useAlerts';
import { fmt } from '@/utils/formatters';

export default function HistoryPage() {
  const { alerts }         = useAlerts();
  const [search,     setSearch]     = useState('');
  const [filterType, setFilterType] = useState('todos');
  const [filterStatus, setFilterStatus] = useState('todos');
  const [selectedAlert, setSelectedAlert] = useState(null);

  const filtered = useMemo(() => {
    return alerts.filter((a) => {
      const matchType   = filterType   === 'todos' || a.type   === filterType;
      const matchStatus = filterStatus === 'todos' || a.status === filterStatus;
      const matchSearch = !search || a.id.includes(search.toUpperCase()) || a.classroom.includes(search.toUpperCase());
      return matchType && matchStatus && matchSearch;
    });
  }, [alerts, filterType, filterStatus, search]);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="px-6 py-3.5 border-b border-[#1e2d4a] flex items-center gap-4 shrink-0 flex-wrap">
        <div>
          <h2 className="text-base font-bold text-text-primary">Historial de alertas</h2>
          <p className="text-xs text-text-hint mt-0.5">{filtered.length} registros</p>
        </div>

        {/* Search */}
        <div className="relative ml-auto">
          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-disabled pointer-events-none">
            <Icon name="search" size={13} />
          </span>
          <input
            type="text"
            placeholder="Buscar ID o aula..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 pr-3 py-1.5 bg-surface border border-[#1e2d4a] rounded-md text-sm text-text-primary placeholder:text-text-hint focus:outline-none focus:border-blue-500 w-48"
          />
        </div>

        {/* Type filter */}
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-3 py-1.5 bg-surface border border-[#1e2d4a] rounded-md text-sm text-text-primary focus:outline-none focus:border-blue-500"
        >
          {['todos', 'AGRESIÓN', 'AISLAMIENTO', 'CAÍDA', 'OTRO'].map((t) => (
            <option key={t} value={t}>{t === 'todos' ? 'Todos los tipos' : t}</option>
          ))}
        </select>

        {/* Status filter */}
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-1.5 bg-surface border border-[#1e2d4a] rounded-md text-sm text-text-primary focus:outline-none focus:border-blue-500"
        >
          {['todos', 'PENDIENTE', 'CONFIRMADA', 'DESCARTADA'].map((s) => (
            <option key={s} value={s}>{s === 'todos' ? 'Todos los estados' : s}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-y-auto">
        <table className="w-full text-sm border-collapse">
          <thead className="sticky top-0 bg-[#0d1321] z-10">
            <tr>
              {['ID', 'Tipo', 'Aula', 'Hora', 'Confianza', 'Estado', 'Escalada'].map((h) => (
                <th key={h} className="px-4 py-2.5 text-left text-[11px] text-text-hint font-semibold tracking-wider border-b border-[#1e2d4a]">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((a) => (
              <tr
                key={a.id}
                onClick={() => setSelectedAlert(a)}
                className="border-b border-[#1e2d4a] hover:bg-white/5 cursor-pointer transition-colors"
              >
                <td className="px-4 py-2.5 font-mono text-text-secondary text-xs">{a.id}</td>
                <td className="px-4 py-2.5"><AlertTypeBadge type={a.type} /></td>
                <td className="px-4 py-2.5 text-text-secondary">Aula {a.classroom}</td>
                <td className="px-4 py-2.5 font-mono text-text-secondary text-xs">{fmt.datetime(a.timestamp)}</td>
                <td className="px-4 py-2.5"><ConfidenceBar value={a.confidence} /></td>
                <td className="px-4 py-2.5"><StatusBadge status={a.status} /></td>
                <td className="px-4 py-2.5">
                  {a.escalated && <Icon name="escalate" size={14} className="text-yellow-400" />}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-text-hint">
            <Icon name="history" size={32} className="mb-3 opacity-30" />
            <p className="text-sm">Sin resultados</p>
          </div>
        )}
      </div>

      {selectedAlert && (
        <AlertDetail alert={selectedAlert} onClose={() => setSelectedAlert(null)} />
      )}
    </div>
  );
}
