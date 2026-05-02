import Icon from './Icon';
import { useToast } from '@/hooks/useToast';

const TYPE_STYLES = {
  success: { border: '#22c55e', icon: 'check',  color: '#22c55e' },
  error:   { border: '#ef4444', icon: 'x',      color: '#ef4444' },
  info:    { border: '#3b82f6', icon: 'alert',  color: '#3b82f6' },
};

export default function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => {
        const s = TYPE_STYLES[t.type] ?? TYPE_STYLES.info;
        return (
          <div
            key={t.id}
            className="flex items-center gap-2.5 px-4 py-2.5 bg-[#131929] rounded-md shadow-2xl max-w-xs pointer-events-auto animate-slide-in-right"
            style={{ border: `1px solid ${s.border}` }}
          >
            <span style={{ color: s.color }} className="shrink-0">
              <Icon name={s.icon} size={15} />
            </span>
            <span className="flex-1 text-sm text-text-primary">{t.message}</span>
            <button
              onClick={() => removeToast(t.id)}
              className="text-text-hint hover:text-text-secondary transition-colors p-0.5"
            >
              <Icon name="x" size={13} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
