import { Link } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import './ProfilePage.css';

const ProfilePage = () => {
  const { user } = useAuthStore();

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric',
      })
    : '—';

  return (
    <div className="profile-page fade-up">
      <div className="profile-card">

        <div className="profile-avatar">
          {user?.name?.charAt(0).toUpperCase()}
        </div>

        <h1 className="profile-name">{user?.name}</h1>

        <span className={`profile-role profile-role--${user?.role}`}>
          {user?.role === 'admin' ? '🔧 Admin' : '🛍️ Customer'}
        </span>

        <div className="profile-info">
          <div className="profile-info__row">
            <span className="profile-info__label">Email</span>
            <span className="profile-info__value">{user?.email}</span>
          </div>
          <div className="profile-info__row">
            <span className="profile-info__label">Member Since</span>
            <span className="profile-info__value">{memberSince}</span>
          </div>
          <div className="profile-info__row">
            <span className="profile-info__label">Account ID</span>
            <span className="profile-info__value profile-info__value--muted">#{user?.id}</span>
          </div>
        </div>

        <div className="profile-links">
          <Link to="/orders" className="profile-link">📦 My Orders</Link>
          <Link to="/cart"   className="profile-link">🛒 My Cart</Link>
          {user?.role === 'admin' && (
            <Link to="/admin" className="profile-link profile-link--admin">🔧 Admin Panel</Link>
          )}
        </div>

      </div>
    </div>
  );
};

export default ProfilePage;