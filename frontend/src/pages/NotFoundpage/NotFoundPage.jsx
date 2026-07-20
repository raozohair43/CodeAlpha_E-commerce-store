import { useNavigate, useLocation } from 'react-router-dom';
import './NotFoundPage.css';

export default function NotFoundPage() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="nf-page">
      <div className="nf-page__content">
        <p className="nf-page__code">404</p>
        <h1 className="nf-page__title">Page Not Found</h1>
        <p className="nf-page__desc">
          The page <span className="nf-page__path">{location.pathname}</span> doesn't exist or has been moved.
        </p>
        <div className="nf-page__actions">
          <button className="nf-page__btn nf-page__btn--primary" onClick={() => navigate('/')}>
            Go Home
          </button>
          <button className="nf-page__btn nf-page__btn--secondary" onClick={() => navigate(-1)}>
            ← Go Back
          </button>
        </div>
      </div>
    </div>
  );
}