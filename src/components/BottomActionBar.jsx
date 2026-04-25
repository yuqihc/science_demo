import React, { useEffect, useRef, useState } from 'react';
import './BottomActionBar.css';

export default function BottomActionBar({ actions, className = '' }) {
  const barRef = useRef(null);
  const [spacerHeight, setSpacerHeight] = useState(96);
  const spacerClassName = className ? `${className}-spacer` : '';

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return undefined;

    const updateSpacer = () => {
      setSpacerHeight(Math.ceil(bar.getBoundingClientRect().height));
    };

    updateSpacer();

    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', updateSpacer);
      return () => window.removeEventListener('resize', updateSpacer);
    }

    const observer = new ResizeObserver(updateSpacer);
    observer.observe(bar);
    window.addEventListener('resize', updateSpacer);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateSpacer);
    };
  }, [actions.length]);

  return (
    <>
      <div ref={barRef} className={`bottom-action-bar ${className}`}>
        <div className="bottom-action-bar-inner">
          {actions.map((action) => (
            <button
              key={action.key ?? action.label}
              type="button"
              className={`bottom-action ${action.variant ? `is-${action.variant}` : ''}`}
              onClick={action.onClick}
              disabled={action.disabled}
            >
              {action.icon && <span className="bottom-action-icon">{action.icon}</span>}
              <span>{action.label}</span>
            </button>
          ))}
        </div>
      </div>
      <div className={`bottom-action-bar-spacer ${spacerClassName}`} style={{ height: spacerHeight }} aria-hidden="true" />
    </>
  );
}
