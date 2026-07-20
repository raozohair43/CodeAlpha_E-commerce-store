import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import '../LoginPage/LoginPage.css';
import useToastStore from '../../store/toastStore';

const RegisterPage = () => {
  const [form, setForm]         = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPass, setShowPass] = useState(false);
  const [fieldErr, setFieldErr] = useState({});

  const { register, loading, error, clearError } = useAuthStore();
  const navigate = useNavigate();
  const { addToast } = useToastStore();

  const validate = () => {
    const errs = {};
    if (!form.name.trim())  errs.name    = 'Name is required';
    if (!form.email)        errs.email   = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email';
    if (!form.password)     errs.password = 'Password is required';
    else if (form.password.length < 6)   errs.password = 'Min 6 characters';
    if (form.confirm !== form.password)  errs.confirm  = 'Passwords do not match';
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
    const res = await register(form.name, form.email, form.password);
    if (res.success) {
      addToast('Account created! Welcome 🎉', 'success');
      navigate('/products');
    } else {
      addToast('Registration failed. Try again.', 'error');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card fade-up">
        <div className="auth-card__header">
          <h1>Create account</h1>
          <p>Join us and start shopping</p>
        </div>

        {error && <div className="auth-alert auth-alert--error">{error}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              id="name" name="name" type="text"
              value={form.name} onChange={handleChange}
              placeholder="John Doe"
              className={fieldErr.name ? 'input--error' : ''}
            />
            {fieldErr.name && <span className="field-error">{fieldErr.name}</span>}
          </div>

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
                placeholder="Min 6 characters"
                className={fieldErr.password ? 'input--error' : ''}
              />
              <button type="button" className="toggle-pass" onClick={() => setShowPass(!showPass)}>
                {showPass ? '🙈' : '👁️'}
              </button>
            </div>
            {fieldErr.password && <span className="field-error">{fieldErr.password}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="confirm">Confirm Password</label>
            <input
              id="confirm" name="confirm" type="password"
              value={form.confirm} onChange={handleChange}
              placeholder="Repeat password"
              className={fieldErr.confirm ? 'input--error' : ''}
            />
            {fieldErr.confirm && <span className="field-error">{fieldErr.confirm}</span>}
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? <span className="spinner" /> : 'Create Account'}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;