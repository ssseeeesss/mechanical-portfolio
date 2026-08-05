import './ProfileCard.css';

export default function ProfileCard({
  avatarUrl,
  name,
  title,
  handle,
  status,
  contactText,
  onContactClick,
}) {
  return (
    <article className="pc-card" aria-label={`${name}个人资料`}>
      <div className="pc-photo-frame">
        <img className="pc-avatar" src={avatarUrl} alt={`${name}证件照`} loading="lazy" decoding="async" />
        <span className="pc-photo-index" aria-hidden="true">PROFILE / 01</span>
      </div>

      <div className="pc-details">
        <span className="pc-handle">@{handle}</span>
        <h3>{name}</h3>
        <p className="pc-title">{title}</p>
        <p className="pc-status">{status}</p>
        <button className="pc-contact-btn" onClick={onContactClick} type="button">
          {contactText}
        </button>
      </div>
    </article>
  );
}
