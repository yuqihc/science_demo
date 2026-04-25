import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import './LessonShell.css';

export default function LessonShell({
  backTo = '/math',
  backLabel = '返回',
  title,
  subtitle,
  children,
  tone = 'purple'
}) {
  return (
    <main className={`lesson-shell lesson-shell-${tone}`}>
      <div className="lesson-shell-nav">
        <Link to={backTo} className="lesson-shell-back">
          <ArrowLeft size={18} aria-hidden="true" />
          <span>{backLabel}</span>
        </Link>
      </div>

      <header className="lesson-shell-header">
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </header>

      <section className="lesson-shell-content">
        {children}
      </section>
    </main>
  );
}
