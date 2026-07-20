import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import useCartStore from '../../store/cartStore';
import './Navbar.css';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled]  = useState(false);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
  const handleOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setDropdownOpen(false);
    }
  };
  document.addEventListener('mousedown', handleOutside);
  return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const { user, token, logout } = useAuthStore();
  const items = useCartStore((s) => s.items);
  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0);

  const location = useLocation();
  const navigate  = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="navbar__inner">

        <Link to="/" className="navbar__logo">
          🛍️ <span>ShopApp</span>
        </Link>

        <div className={`navbar__links ${menuOpen ? 'navbar__links--open' : ''}`}>
          <Link to="/products" className={location.pathname === '/products' ? 'active' : ''}>Products</Link>

          {token && (
            <>
              <Link to="/cart" className={location.pathname === '/cart' ? 'active' : ''}>
                Cart {cartCount > 0 && <span className="navbar__badge">{cartCount}</span>}
              </Link>
              <Link to="/orders" className={location.pathname === '/orders' ? 'active' : ''}>Orders</Link>
            </>
          )}

          {token ? (
  <div className="navbar__user" ref={dropdownRef}>
    <button
      className="navbar__avatar-btn"
      onClick={() => setDropdownOpen(prev => !prev)}
    >
      <span className="navbar__avatar">{user.name.charAt(0).toUpperCase()}</span>
      <span className="navbar__username">{user.name.split(' ')[0]}</span>
      <span className="navbar__chevron">{dropdownOpen ? '▲' : '▼'}</span>
    </button>

    {dropdownOpen && (
      <div className="navbar__dropdown">
        <Link to="/profile" className="navbar__dropdown-item" onClick={() => setDropdownOpen(false)}>
          👤 Profile
        </Link>
        {user.role === 'admin' && (
          <Link to="/admin" className="navbar__dropdown-item" onClick={() => setDropdownOpen(false)}>
            🔧 Admin Panel
          </Link>
        )}
        <button
          className="navbar__dropdown-item navbar__dropdown-logout"
          onClick={() => { setDropdownOpen(false); handleLogout(); }}
        >
          🚪 Logout
        </button>
      </div>
    )}
  </div>
) : (
  <div className="navbar__auth">
    <Link to="/login" className="btn-ghost">Login</Link>
    <Link to="/register" className="btn-accent">Register</Link>
  </div>
)}
        </div>

        <button className="navbar__burger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
          <span className={menuOpen ? 'open' : ''} />
          <span className={menuOpen ? 'open' : ''} />
          <span className={menuOpen ? 'open' : ''} />
        </button>

      </div>
    </nav>
  );
};

export default Navbar;