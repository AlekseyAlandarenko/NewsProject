import classNames from 'classnames';
import { ButtonHTMLAttributes, ReactNode } from 'react';
import './Button.scss';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: 'primary' | 'outline' | 'danger';
	isLoading?: boolean;
	children?: ReactNode;
}

export const Button = ({
	children,
	variant = 'primary',
	className,
	isLoading = false,
	disabled,
	...props
}: ButtonProps) => {
	const isDisabled = Boolean(disabled) || isLoading;

	return (
		<button
			className={classNames('btn', `btn--${variant}`, className, {
				'btn--disabled': isDisabled,
			})}
			disabled={isDisabled}
			aria-busy={isLoading || undefined}
			{...props}
		>
			{isLoading ? (
				<span className="btn__content">
					<span className="btn__spinner" aria-hidden="true" />
					<span className="btn__label">Загрузка…</span>
				</span>
			) : (
				<span className="btn__content">{children}</span>
			)}
		</button>
	);
};
