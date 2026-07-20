import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import useToastStore from '../../store/toastStore';
import './LoginPage.css';

const LoginPage = () => {
  const [form, setForm]       = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [fieldErr, setFieldErr] = useState({});
  const { addToast } = useToastStore();

  const { login, loading, error, clearError } = useAuthStore();
  const navigate = useNavigate();

  const validate = () => {
    const errs = {};
    if (!form.email)    errs.email    = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email';
    if (!form.password) errs.password = 'Password is required';
    setFieldErr(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    clearError();
    setFieldErr((p) => ({ ...p, [e.target.name]: '' }));
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    const res = await login(form.email, form.password);
    if (res.success) {
      addToast('Welcome back!', 'success');
      navigate('/products');
    } else {
      addToast('Invalid email or password', 'error');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card fade-up">
        <div className="auth-card__header">
          <h1>Welcome back</h1>
          <p>Sign in to your account</p>
        </div>

        {error && <div className="auth-alert auth-alert--error">{error}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email" name="email" type="email"
              value={form.email} onChange={handleChange}
              placeholder="you@example.com"
              className={fieldErr.email ? 'input--error' : ''}
            />
            {fieldErr.email && <span className="field-error">{fieldErr.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-wrapper">
              <input
                id="password" name="password"
                type={showPass ? 'text' : 'password'}
                value={form.password} onChange={handleChange}
                placeholder="••••••••"
                className={fieldErr.password ? 'input--error' : ''}
              />
              <button type="button" className="toggle-pass" onClick={() => setShowPass(!showPass)}>
                {showPass ? '🙈' : '👁️'}
              </button>
            </div>
            {fieldErr.password && <span className="field-error">{fieldErr.password}</span>}
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? <span className="spinner" /> : 'Sign In'}
          </button>
        </form>

        <p className="auth-footer">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;