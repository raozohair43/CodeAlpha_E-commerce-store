import { Link } from 'react-router-dom';
import './Footer.css';

const LINKS = {
  Shop:    [{ label: 'Products', to: '/products' }, { label: 'Cart', to: '/cart' }, { label: 'Orders', to: '/orders' }],
  Account: [{ label: 'Login', to: '/login' }, { label: 'Register', to: '/register' }],
};

const Footer = () => {

  return (
    <footer className="footer">
      <div className="footer__inner">

        <div className="footer__brand">
          <Link to="/" className="footer__logo">🛍️ <span>ShopApp</span></Link>
          <p>Modern shopping experience built for everyone. Fast, secure, and reliable.</p>
        </div>

        {Object.entries(LINKS).map(([section, links]) => (
          <div className="footer__col" key={section}>
            <h4>{section}</h4>
            <ul>
              {links.map((l) => (
                <li key={l.label}><Link to={l.to}>{l.label}</Link></li>
              ))}
            </ul>
          </div>
        ))}

      </div>

      <div className="footer__bottom">
        <p>© {new Date().getFullYear()} ShopApp. All rights reserved.</p>
        <p>Built with ❤️ using React + Express</p>
      </div>
    </footer>
  );
};

export default Footer;