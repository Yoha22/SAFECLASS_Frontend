import { useState } from 'react';

export default function Tooltip({ text, children }) {
  const [show, setShow] = useState(false);
  return (
    <div
      className="relative inline-flex"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && (
        <div className="absolute bottom-[calc(100%+6px)] left-1/2 -translate-x-1/2 bg-surface border border-[#1e2d4a] px-2.5 py-1 rounded text-xs text-text-secondary whitespace-nowrap z-[1000] shadow-lg pointer-events-none">
          {text}
        </div>
      )}
    </div>
  );
}
