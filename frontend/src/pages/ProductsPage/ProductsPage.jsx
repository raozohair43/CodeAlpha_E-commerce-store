import { useState, useEffect, useCallback } from 'react';
import api from '../../api/axios';
import ProductCard from '../../components/ProductCard/ProductCard';
import './ProductsPage.css';

export default function ProductsPage() {
  const [products, setProducts]   = useState([]);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState('');
  const [page, setPage]           = useState(1);
  const [totalPages, setTotal]    = useState(1);
  const [minPrice, setMinPrice]   = useState('');
  const [maxPrice, setMaxPrice]   = useState('');
  const [applied, setApplied]     = useState({ min: '', max: '' });

  const fetchProducts = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const params = { page, limit: 12 };
      if (applied.min) params.minPrice = applied.min;
      if (applied.max) params.maxPrice = applied.max;
      const { data } = await api.get('/products', { params });
      setProducts(data.products);
      setTotal(data.pages ?? 1);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load products.');
    } finally {
      setLoading(false);
    }
  }, [page, applied]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const handleFilter = (e) => {
    e.preventDefault();
    setPage(1);
    setApplied({ min: minPrice, max: maxPrice });
  };

  const handleClear = () => {
    setMinPrice(''); setMaxPrice('');
    setPage(1); setApplied({ min: '', max: '' });
  };

  return (
    <div className="products-page">
      <div className="products-page__header">
        <h1 className="products-page__title">All Products</h1>
        <form className="products-page__filters" onSubmit={handleFilter}>
          <input
            type="number" min="0" placeholder="Min $"
            value={minPrice} onChange={(e) => setMinPrice(e.target.value)}
            className="products-page__filter-input"
          />
          <input
            type="number" min="0" placeholder="Max $"
            value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)}
            className="products-page__filter-input"
          />
          <button type="submit" className="products-page__filter-btn">Apply</button>
          {(applied.min || applied.max) && (
            <button type="button" className="products-page__clear-btn" onClick={handleClear}>
              Clear
            </button>
          )}
        </form>
      </div>

      {error && <p className="products-page__error">{error}</p>}

      {loading ? (
        <div className="products-page__grid">
          {[...Array(8)].map((_, i) => <div key={i} className="product-skeleton" />)}
        </div>
      ) : products.length === 0 ? (
        <p className="products-page__empty">No products found.</p>
      ) : (
        <div className="products-page__grid">
          {products.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}

      {totalPages > 1 && (
        <div className="products-page__pagination">
          <button className="products-page__page-btn"
            disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
            ← Prev
          </button>
          <span className="products-page__page-info">Page {page} of {totalPages}</span>
          <button className="products-page__page-btn"
            disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>
            Next →
          </button>
        </div>
      )}
    </div>
  );
}