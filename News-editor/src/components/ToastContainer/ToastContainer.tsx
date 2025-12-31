import { useToast } from '../../context/ToastContext';
import { Toast as UIToast } from '../UI/Toast/Toast';
import './ToastContainer.scss';

export const ToastContainer = () => {
	const { toasts, removeToast } = useToast();

	return (
		<div className="toast-container" aria-live="polite" aria-atomic="true">
			{toasts.map((toast) => (
				<UIToast
					key={toast.id}
					type={toast.type}
					message={toast.message}
					onClick={() => removeToast(toast.id)}
				/>
			))}
		</div>
	);
};
