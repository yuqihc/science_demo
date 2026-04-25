import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Clock3, Home, RotateCcw } from 'lucide-react';
import './DirectoryPage.css';

function NavButton({ to, icon: Icon, children }) {
  return (
    <Link to={to} className="directory-nav-button">
      <Icon size={18} aria-hidden="true" />
      <span>{children}</span>
    </Link>
  );
}

function DirectoryCard({ item }) {
  const Icon = item.icon;
  const content = (
    <>
      <div className="directory-card-top">
        <div className="directory-icon" style={{ color: item.accent }}>
          <Icon size={28} aria-hidden="true" />
        </div>
        <span className={`directory-status ${item.enabled ? 'is-ready' : ''}`}>
          {item.enabled ? <CheckCircle2 size={16} /> : <Clock3 size={16} />}
          {item.enabled ? '可用' : '建设中'}
        </span>
      </div>
      <div className="directory-card-copy">
        <p className="directory-card-kicker">{item.subtitle}</p>
        <h2>{item.title}</h2>
        <p>{item.desc}</p>
      </div>
      <div className="directory-card-action" style={{ color: item.accent }}>
        <span>{item.meta}</span>
        <ArrowRight size={18} aria-hidden="true" />
      </div>
    </>
  );

  if (!item.to || !item.enabled) {
    return (
      <article className="directory-card is-disabled" style={{ '--accent': item.accent }}>
        {content}
      </article>
    );
  }

  return (
    <Link to={item.to} className="directory-card" style={{ '--accent': item.accent }}>
      {content}
    </Link>
  );
}

export default function DirectoryPage({
  badge,
  title,
  subtitle,
  primaryAction,
  secondaryAction,
  cards,
  aside,
  about,
  navBackTo,
  navBackLabel = '返回',
  tone = 'science'
}) {
  return (
    <main className={`directory-page directory-tone-${tone}`}>
      <div className="directory-container">
        <nav className="directory-nav" aria-label="页面导航">
          <NavButton to="/" icon={Home}>首页</NavButton>
          {navBackTo && <NavButton to={navBackTo} icon={RotateCcw}>{navBackLabel}</NavButton>}
        </nav>

        <section className="directory-hero">
          <div className="directory-hero-copy">
            <p className="directory-badge">{badge}</p>
            <h1>{title}</h1>
            <p>{subtitle}</p>
            <div className="directory-actions">
              {primaryAction && (
                <Link to={primaryAction.to} className="directory-action is-primary">
                  <span>{primaryAction.label}</span>
                  <ArrowRight size={18} aria-hidden="true" />
                </Link>
              )}
              {secondaryAction && (
                <Link to={secondaryAction.to} className="directory-action">
                  <span>{secondaryAction.label}</span>
                  <ArrowRight size={18} aria-hidden="true" />
                </Link>
              )}
            </div>
          </div>

          {aside && (
            <aside className="directory-aside">
              <p>{aside.label}</p>
              <h2>{aside.title}</h2>
              <span>{aside.text}</span>
              <Link to={aside.to} className="directory-action is-compact">
                <span>{aside.cta}</span>
                <ArrowRight size={18} aria-hidden="true" />
              </Link>
            </aside>
          )}
        </section>

        <section className="directory-grid" aria-label="模块列表">
          {cards.map((item) => (
            <DirectoryCard key={item.key} item={item} />
          ))}
        </section>

        {about && (
          <section className="directory-about">
            <p>{about.label}</p>
            <h2>{about.title}</h2>
            <span>{about.text}</span>
          </section>
        )}
      </div>
    </main>
  );
}
