import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../api/axios';
import  useCartStore  from '../../store/cartStore';
import  useAuthStore  from '../../store/authStore';
import './ProductDetailPage.css';
import useToastStore from '../../store/toastStore';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuthStore();
  const { addItem } = useCartStore();
  const { addToast } = useToastStore();

  const [product, setProduct]   = useState(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');
  const [qty, setQty]           = useState(1);
  const [adding, setAdding]     = useState(false);
  const [added, setAdded]       = useState(false);
  const [cartErr, setCartErr]   = useState('');
  

  useEffect(() => {
    const fetch = async () => {
      setLoading(true); setError('');
      try {
        const { data } = await api.get(`/products/${id}`);
        setProduct(data);
      } catch (err) {
        const status = err.response?.status;
        setError(status === 404 ? 'Product not found.' : 'Failed to load product.');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  const handleAddToCart = async () => {
    if (!token) { navigate('/login'); return; }
    setAdding(true); setCartErr('');
    try {
  await addItem(product.id, qty);
  setAdded(true);
  addToast('Item added to cart!', 'success');
  setTimeout(() => setAdded(false), 2500);
} catch {
  setCartErr('Could not add to cart. Try again.');
  addToast('Could not add to cart. Try again.', 'error');
  setTimeout(() => setCartErr(''), 3000);
} finally {
      setAdding(false);
    }
  };

  if (loading) return (
    <div className="pdp pdp--loading">
      <div className="pdp__skeleton-img" />
      <div className="pdp__skeleton-body">
        {[...Array(4)].map((_, i) => <div key={i} className="pdp__skeleton-line" />)}
      </div>
    </div>
  );

  if (error) return (
    <div className="pdp pdp--error">
      <p className="pdp__error-msg">{error}</p>
      <Link to="/products" className="pdp__back-link">← Back to Products</Link>
    </div>
  );

  const outOfStock = product.stock === 0;

  return (
    <div className="pdp">
      <Link to="/products" className="pdp__back-link">← Back to Products</Link>

      <div className="pdp__content">
        <div className="pdp__img-wrap">
          <img
            src={product.imageUrl || '/placeholder.png'}
            alt={product.name}
            className="pdp__img"
            onError={(e) => { e.target.src = '/placeholder.png'; }}
          />
        </div>

        <div className="pdp__details">
          <h1 className="pdp__name">{product.name}</h1>
          <p className="pdp__price">${Number(product.price).toFixed(2)}</p>

          <p className={`pdp__stock ${outOfStock ? 'out' : ''}`}>
            {outOfStock ? 'Out of Stock' : `In Stock (${product.stock} available)`}
          </p>

          <p className="pdp__desc">{product.description}</p>

          {!outOfStock && (
            <div className="pdp__qty-row">
              <label className="pdp__qty-label">Qty:</label>
              <button className="pdp__qty-btn"
                onClick={() => setQty((q) => Math.max(1, q - 1))} disabled={qty <= 1}>−</button>
              <span className="pdp__qty-val">{qty}</span>
              <button className="pdp__qty-btn"
                onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                disabled={qty >= product.stock}>+</button>
            </div>
          )}

          {cartErr && <p className="pdp__cart-err">{cartErr}</p>}

          <button
            className={`pdp__add-btn${added ? ' added' : ''}`}
            onClick={handleAddToCart}
            disabled={outOfStock || adding || added}
          >
            {outOfStock ? 'Unavailable' : adding ? 'Adding…' : added ? '✓ Added to Cart' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
}