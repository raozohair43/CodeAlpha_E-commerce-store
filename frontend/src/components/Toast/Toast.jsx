import useToastStore from '../../store/toastStore';
import './Toast.css';

export default function Toast() {
  const { toasts, removeToast } = useToastStore();

  if (!toasts.length) return null;

  return (
    <div className="toast-container">
      {toasts.map((t) => (
        <div key={t.id} className={`toast toast--${t.type}`}>
          <span>{t.message}</span>
          <button className="toast__close" onClick={() => removeToast(t.id)}>✕</button>
        </div>
      ))}
    </div>
  );
}