import { Link } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import './HomePage.css';

const FEATURES = [
  { icon: '🚀', title: 'Fast Delivery',    desc: 'Get your orders delivered quickly and reliably.' },
  { icon: '🔒', title: 'Secure Payments',  desc: 'Your payment info is always safe with us.' },
  { icon: '↩️', title: 'Easy Returns',     desc: 'Hassle-free returns within 30 days.' },
  { icon: '🎧', title: '24/7 Support',     desc: 'We are here for you around the clock.' },
];

const CATEGORIES = [
  { icon: '📱', label: 'Electronics' },
  { icon: '👕', label: 'Clothing'    },
  { icon: '📚', label: 'Books'       },
  { icon: '🏡', label: 'Home'        },
  { icon: '⚽', label: 'Sports'      },
  { icon: '💄', label: 'Beauty'      },
];

const HomePage = () => {
  const user = useAuthStore((s) => s.user);

  return (
    <div className="home">

      {/* Hero */}
      <section className="home__hero">
        <div className="home__hero-content fade-up">
          <span className="home__badge">New Arrivals ✨</span>
          <h1>Shop the <span className="home__accent">Latest</span> Trends</h1>
          <p>Discover thousands of products at unbeatable prices. Fast delivery, easy returns.</p>
          <div className="home__hero-actions">
            <Link to="/products" className="home__btn-primary">Shop Now →</Link>
            {!user && <Link to="/register" className="home__btn-secondary">Join Free</Link>}
          </div>
        </div>
        <div className="home__hero-visual fade-in">
          <div className="home__glow" />
          <div className="home__orb home__orb--1" />
          <div className="home__orb home__orb--2" />
          <div className="home__hero-emoji">🛍️</div>
        </div>
      </section>

      {/* Features */}
      <section className="home__features">
        {FEATURES.map((f) => (
          <div className="home__feature-card fade-up" key={f.title}>
            <span className="home__feature-icon">{f.icon}</span>
            <h3>{f.title}</h3>
            <p>{f.desc}</p>
          </div>
        ))}
      </section>

      {/* Categories */}
      <section className="home__categories">
        <div className="home__section-header">
          <h2>Shop by <span className="home__accent">Category</span></h2>
          <p>Find exactly what you're looking for</p>
        </div>
        <div className="home__categories-grid">
          {CATEGORIES.map((c) => (
            <Link to="/products" className="home__category-card" key={c.label}>
              <span className="home__category-icon">{c.icon}</span>
              <span className="home__category-label">{c.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="home__cta">
        <div className="home__cta-inner fade-up">
          <h2>Ready to start shopping?</h2>
          <p>Join thousands of happy customers today.</p>
          <Link to="/products" className="home__btn-primary">Browse Products →</Link>
        </div>
      </section>

    </div>
  );
};

export default HomePage;