export default function SectionHeader({ eyebrow, title, subtitle, titleId }) {
  return (
    <header className="section-header">
      <p className="section-kicker">{eyebrow}</p>
      <h2 id={titleId} className="section-title">{title}</h2>
      {subtitle && <p className="section-subtitle">{subtitle}</p>}
    </header>
  );
}
