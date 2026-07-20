import { useState, useEffect } from 'react';
import axios from '../../api/axios';
import useAuthStore from '../../store/authStore';
import useToastStore from '../../store/toastStore';
import './ProductFormModal.css';

export default function ProductFormModal({ isOpen, onClose, editTarget, onSuccess }) {
  const { token } = useAuthStore();
  const { addToast } = useToastStore();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '', description: '', price: '', imageUrl: '', stock: '',
  });

  useEffect(() => {
    if (editTarget) {
      setForm({
        name: editTarget.name,
        description: editTarget.description || '',
        price: editTarget.price,
        imageUrl: editTarget.imageUrl || '',
        stock: editTarget.stock,
      });
    } else {
      setForm({ name: '', description: '', price: '', imageUrl: '', stock: '' });
    }
  }, [editTarget, isOpen]);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const payload = {
      ...form,
      price: parseFloat(form.price),
      stock: parseInt(form.stock),
    };
    try {
      if (editTarget) {
        await axios.put(`/products/${editTarget.id}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        addToast('Product updated', 'success');
      } else {
        await axios.post('/products', payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        addToast('Product added', 'success');
      }
      onSuccess();
      onClose();
    } catch {
      addToast('Save failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>{editTarget ? 'Edit Product' : 'Add Product'}</h2>
        <form onSubmit={handleSubmit}>
          <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
          <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} rows={3} />
          <input name="price" type="number" step="0.01" placeholder="Price" value={form.price} onChange={handleChange} required />
          <input name="imageUrl" placeholder="Image URL" value={form.imageUrl} onChange={handleChange} />
          <input name="stock" type="number" placeholder="Stock" value={form.stock} onChange={handleChange} required />
          <div className="modal__actions">
            <button type="button" onClick={onClose}>Cancel</button>
            <button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}