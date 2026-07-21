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
    name: '', description: '', price: '', image: '', stock: '',
  });

  const [imageMode, setImageMode] = useState('url'); // 'url' | 'file'
const [uploading, setUploading] = useState(false);
const [preview, setPreview]     = useState('');

  useEffect(() => {
  if (editTarget) {
    setForm({
      name: editTarget.name,
      description: editTarget.description || '',
      price: editTarget.price,
      image: editTarget.image || '',
      stock: editTarget.stock,
    });
    setPreview(editTarget.imageUrl || '');
  } else {
    setForm({ name: '', description: '', price: '', image: '', stock: '' });
    setPreview('');
  }
  setImageMode('url');
}, [editTarget, isOpen]);

  const handleChange = (e) => {
  setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  if (e.target.name === 'image') setPreview(e.target.value);
  };

  const handleFileChange = async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  setUploading(true);
  try {
    const formData = new FormData();
    formData.append('image', file);
    const { data } = await axios.post('/upload', formData, {
      headers: { 'Content-Type': undefined },
    });
    setForm((prev) => ({ ...prev, image: data.url }));
    setPreview(data.url);
    addToast('Image uploaded', 'success');
  } catch {
    addToast('Image upload failed', 'error');
  } finally {
    setUploading(false);
  }
};

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

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>{editTarget ? 'Edit Product' : 'Add Product'}</h2>
        <form onSubmit={handleSubmit}>
          <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
          <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} rows={3} />
          <input name="price" type="number" step="0.01" placeholder="Price" value={form.price} onChange={handleChange} required />
          
          <div className="modal__img-section">
  <div className="modal__img-toggle">
    <button
      type="button"
      className={`modal__toggle-btn ${imageMode === 'url' ? 'active' : ''}`}
      onClick={() => setImageMode('url')}
    >URL</button>
    <button
      type="button"
      className={`modal__toggle-btn ${imageMode === 'file' ? 'active' : ''}`}
      onClick={() => setImageMode('file')}
    >Upload File</button>
  </div>

  {imageMode === 'url' ? (
    <input
      name="image"
      placeholder="Paste image URL"
      value={form.image}
      onChange={handleChange}
    />
  ) : (
    <div className="modal__file-wrap">
      <input
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleFileChange}
        className="modal__file-input"
        disabled={uploading}
      />
      {uploading && <span className="modal__uploading">Uploading...</span>}
    </div>
  )}

  {preview && (
    <div className="modal__preview">
      <img src={preview} alt="Preview" />
    </div>
  )}
</div>

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