import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useCartStore from '../../store/cartStore';
import useAuthStore from '../../store/authStore';
import './ProductCard.css';

export default function ProductCard({ product }) {
  const { addItem } = useCartStore();
  const { token } = useAuthStore();
  const navigate = useNavigate();
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState('');

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (!token) { navigate('/login'); return; }
    setAdding(true);
    setError('');
    try {
      await addItem(product.id, 1);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch {
      setError('Failed to add');
      setTimeout(() => setError(''), 2500);
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="product-card">
      <Link to={`/products/${product.id}`} className="product-card__link">
        <div className="product-card__img-wrap">
          <img
            src={product.imageUrl || '/placeholder.png'}
            alt={product.name}
            className="product-card__img"
            onError={(e) => { e.target.src = '/placeholder.png'; }}
          />
        </div>
        <div className="product-card__body">
          <h3 className="product-card__name">{product.name}</h3>
          <p className="product-card__desc">
            {product.description?.length > 75
              ? product.description.slice(0, 75) + '…'
              : product.description}
          </p>
          <span className="product-card__price">
            ${Number(product.price).toFixed(2)}
          </span>
        </div>
      </Link>
      {error && <p className="product-card__error">{error}</p>}
      <button
        className={`product-card__btn${added ? ' added' : ''}`}
        onClick={handleAddToCart}
        disabled={adding || added}
      >
        {adding ? 'Adding…' : added ? '✓ Added' : 'Add to Cart'}
      </button>
    </div>
  );
}