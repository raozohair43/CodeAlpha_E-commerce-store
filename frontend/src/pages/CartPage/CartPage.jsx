import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useCartStore from '../../store/cartStore';
import api from '../../api/axios'
import './CartPage.css';
import useToastStore from '../../store/toastStore';

export default function CartPage() {
  const { items, fetchCart, removeItem, updateItem } = useCartStore();
  const navigate = useNavigate();
  const { addToast } = useToastStore();

  const [loading, setLoading]       = useState(true);
  const [ordering, setOrdering]     = useState(false);
  const [orderError, setOrderError] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await fetchCart();
      setLoading(false);
    };
    load();
  }, [fetchCart]);

  const handleQtyChange = async (productId, newQty) => {
    if (newQty < 1) return;
    setUpdatingId(productId);
    await updateItem(productId, newQty);
    setUpdatingId(null);
  };

  const handleRemove = async (productId) => {
    setUpdatingId(productId);
    await removeItem(productId);
    setUpdatingId(null);
  };

  const handlePlaceOrder = async () => {
    setOrdering(true); setOrderError('');
    try {
      await api.post('/orders');
      await fetchCart();
      addToast('Order placed successfully!', 'success');
      navigate('/orders');
    } catch (err) 
    {
      const msg = err.response?.data?.error || 'Failed to place order.';
      setOrderError(msg);
      addToast(msg, 'error');
    } finally 
    {
      setOrdering(false);
    }
  };

  const subtotal = items.reduce(
    (sum, item) => sum + Number(item.product.price) * item.quantity, 0
  );

  if (loading) return (
    <div className="cart-page">
      <h1 className="cart-page__title">Your Cart</h1>
      <div className="cart-page__skeleton-list">
        {[...Array(3)].map((_, i) => <div key={i} className="cart-skeleton-row" />)}
      </div>
    </div>
  );

  if (items.length === 0) return (
    <div className="cart-page cart-page--empty">
      <h1 className="cart-page__title">Your Cart</h1>
      <p className="cart-page__empty-msg">Your cart is empty.</p>
      <Link to="/products" className="cart-page__shop-link">Browse Products →</Link>
    </div>
  );

  return (
    <div className="cart-page">
      <h1 className="cart-page__title">Your Cart</h1>

      <div className="cart-page__layout">
        <ul className="cart-page__list">
          {items.map((item) => (
            <li key={item.productId} className={`cart-item${updatingId === item.productId ? ' cart-item--busy' : ''}`}>
              <img
                src={item.product.imageUrl || '/placeholder.png'}
                alt={item.product.name}
                className="cart-item__img"
                onError={(e) => { e.target.src = '/placeholder.png'; }}
              />
              <div className="cart-item__info">
                <Link to={`/products/${item.productId}`} className="cart-item__name">
                  {item.product.name}
                </Link>
                <p className="cart-item__unit">
                  ${Number(item.product.price).toFixed(2)} each
                </p>
              </div>

              <div className="cart-item__controls">
                <button className="cart-item__qty-btn"
                  onClick={() => handleQtyChange(item.productId, item.quantity - 1)}
                  disabled={item.quantity <= 1 || updatingId === item.productId}>−</button>
                <span className="cart-item__qty">{item.quantity}</span>
                <button className="cart-item__qty-btn"
                  onClick={() => handleQtyChange(item.productId, item.quantity + 1)}
                  disabled={item.quantity >= item.product.stock || updatingId === item.productId}>+</button>
              </div>

              <p className="cart-item__line-total">
                ${(Number(item.product.price) * item.quantity).toFixed(2)}
              </p>

              <button className="cart-item__remove"
                onClick={() => handleRemove(item.productId)}
                disabled={updatingId === item.productId}
                aria-label="Remove item">✕</button>
            </li>
          ))}
        </ul>

        <div className="cart-page__summary">
          <h2 className="cart-summary__heading">Order Summary</h2>
          <div className="cart-summary__row">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="cart-summary__row cart-summary__row--total">
            <span>Total</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          {orderError && <p className="cart-summary__error">{orderError}</p>}
          <button
            className="cart-summary__btn"
            onClick={handlePlaceOrder}
            disabled={ordering}>
            {ordering ? 'Placing Order…' : 'Place Order'}
          </button>
          <Link to="/products" className="cart-summary__continue">← Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
}