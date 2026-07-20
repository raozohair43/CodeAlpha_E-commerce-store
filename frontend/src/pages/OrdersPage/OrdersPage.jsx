import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import './OrdersPage.css';
import useToastStore from '../../store/toastStore';

export default function OrdersPage() {
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');
  const [expanded, setExpanded] = useState(null);
  const { addToast } = useToastStore();

  useEffect(() => {
    const fetch = async () => {
      setLoading(true); setError('');
      try {
        const { data } = await api.get('/orders');
        setOrders(data);
      } catch (err) {
        const msg = err.response?.data?.error || 'Failed to load orders.';
        setError(msg);
        addToast(msg, 'error');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const toggleExpand = (id) =>
    setExpanded((prev) => (prev === id ? null : id));

  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString(undefined, {
      year: 'numeric', month: 'short', day: 'numeric',
    });

  if (loading) return (
    <div className="orders-page">
      <h1 className="orders-page__title">My Orders</h1>
      <div className="orders-page__skeleton-list">
        {[...Array(3)].map((_, i) => <div key={i} className="order-skeleton-row" />)}
      </div>
    </div>
  );

  if (error) return (
    <div className="orders-page">
      <h1 className="orders-page__title">My Orders</h1>
      <p className="orders-page__error">{error}</p>
    </div>
  );

  if (orders.length === 0) return (
    <div className="orders-page orders-page--empty">
      <h1 className="orders-page__title">My Orders</h1>
      <p className="orders-page__empty-msg">You haven't placed any orders yet.</p>
      <Link to="/products" className="orders-page__shop-link">Start Shopping →</Link>
    </div>
  );

  return (
    <div className="orders-page">
      <h1 className="orders-page__title">My Orders</h1>

      <ul className="orders-list">
        {orders.map((order) => (
          <li key={order.id} className="order-card">
            <button
              className="order-card__header"
              onClick={() => toggleExpand(order.id)}
              aria-expanded={expanded === order.id}
            >
              <div className="order-card__meta">
                <span className="order-card__id">Order #{order.id}</span>
                <span className="order-card__date">{formatDate(order.createdAt)}</span>
              </div>
              <div className="order-card__right">
                <span className="order-card__total">
                  ${Number(order.total).toFixed(2)}
                </span>
                <span className={`order-card__chevron${expanded === order.id ? ' open' : ''}`}>
                  ›
                </span>
              </div>
            </button>

            {expanded === order.id && (
              <ul className="order-items">
                {order.items.map((item) => (
                  <li key={item.id} className="order-item">
                    <img
                      src={item.product?.imageUrl || '/placeholder.png'}
                      alt={item.product?.name}
                      className="order-item__img"
                      onError={(e) => { e.target.src = '/placeholder.png'; }}
                    />
                    <div className="order-item__info">
                      <Link
                        to={`/products/${item.productId}`}
                        className="order-item__name"
                      >
                        {item.product?.name}
                      </Link>
                      <p className="order-item__meta">
                        Qty: {item.quantity} × ${Number(item.price).toFixed(2)}
                      </p>
                    </div>
                    <span className="order-item__subtotal">
                      ${(item.quantity * Number(item.price)).toFixed(2)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}