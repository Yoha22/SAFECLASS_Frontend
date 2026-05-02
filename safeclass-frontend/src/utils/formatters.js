const locale = 'es-CO';

export const fmt = {
  time: (ts) =>
    new Date(ts).toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' }),

  datetime: (ts) =>
    new Date(ts).toLocaleString(locale, {
      day: '2-digit', month: '2-digit', year: '2-digit',
      hour: '2-digit', minute: '2-digit',
    }),

  date: (ts) =>
    new Date(ts).toLocaleDateString(locale, {
      day: '2-digit', month: '2-digit', year: 'numeric',
    }),

  percent: (v) => `${Math.round(v * 100)}%`,

  confidence: (v) => `${Math.round(v * 100)}%`,

  relativeTime: (ts) => {
    const diff = Date.now() - new Date(ts).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1)  return 'Ahora';
    if (mins < 60) return `Hace ${mins} min`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24)  return `Hace ${hrs} h`;
    return fmt.date(ts);
  },
};
