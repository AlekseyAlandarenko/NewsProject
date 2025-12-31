import classNames from 'classnames';
import { InputHTMLAttributes, forwardRef } from 'react';
import './Input.scss';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
	error?: string;
	fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
	({ error, fullWidth = false, className, ...props }, ref) => {
		const showError = Boolean(error);

		return (
			<div className={classNames('input-wrapper', { 'input-wrapper--full': fullWidth }, className)}>
				<input
					ref={ref}
					className={classNames('input', { 'input--error': showError })}
					aria-invalid={showError || undefined}
					{...props}
				/>
				{showError && (
					<p role="alert" className="input-wrapper__error">
						{error}
					</p>
				)}
			</div>
		);
	},
);

Input.displayName = 'Input';
