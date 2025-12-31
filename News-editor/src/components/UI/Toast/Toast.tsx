import classNames from 'classnames';
import { ReactNode, HTMLAttributes } from 'react';
import './Toast.scss';

interface ToastProps extends HTMLAttributes<HTMLDivElement> {
	type: 'success' | 'error';
	message: string;
	icon?: ReactNode;
}

const DEFAULT_ICONS: Record<'success' | 'error', ReactNode> = {
	success: '✓',
	error: '✕',
};

export const Toast = ({ type, message, icon, className, ...props }: ToastProps) => {
	return (
		<div
			className={classNames('toast', `toast--${type}`, className)}
			role="status"
			aria-live="polite"
			{...props}
		>
			<div className="toast__icon" aria-hidden="true">
				{icon || DEFAULT_ICONS[type]}
			</div>

			<div className="toast__message">{message}</div>
		</div>
	);
};
