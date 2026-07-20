import { useEffect, useState } from 'react';
import axios from '../../api/axios';
import useAuthStore from '../../store/authStore';
import useToastStore from '../../store/toastStore';
import './AdminPage.css';
import ProductFormModal from '../../components/ProductFormModal/ProductFormModal';

export default function AdminPage() {
  const { token } = useAuthStore();
  const { addToast } = useToastStore();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('/products?limit=100');
      setProducts(res.data.products);
    } catch {
      addToast('Failed to load products', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await axios.delete(`/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      addToast('Product deleted', 'success');
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      addToast(err.message || 'Delete failed', 'error');
    }
  };

  const openAdd = () => { setEditTarget(null); setModalOpen(true); };
  const openEdit = (product) => { setEditTarget(product); setModalOpen(true); };

  if (loading) return <p className="admin__loading">Loading...</p>;

  return (
    <div className="admin">
      <div className="admin__header">
        <h1>Admin — Products</h1>
        <button className="admin__add-btn" onClick={openAdd}>+ Add Product</button>
      </div>
      <table className="admin__table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td>{p.name}</td>
              <td>${parseFloat(p.price).toFixed(2)}</td>
              <td>{p.stock}</td>
              <td className="admin__actions">
                <button onClick={() => openEdit(p)}>Edit</button>
                <button className="admin__delete" onClick={() => handleDelete(p.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ProductFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        editTarget={editTarget}
        onSuccess={fetchProducts}
      />

    </div>
  );
}