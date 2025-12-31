import classNames from 'classnames';
import { HTMLAttributes, ReactNode } from 'react';
import './Paragraph.scss';

interface ParagraphProps extends HTMLAttributes<HTMLParagraphElement> {
	size?: 'sm' | 'md' | 'lg';
	color?: 'default' | 'muted' | 'primary';
	children?: ReactNode;
}

export const Paragraph = ({
	children,
	size = 'md',
	color = 'default',
	className,
	dangerouslySetInnerHTML,
	...props
}: ParagraphProps) => {
	const baseClasses = classNames(
		'paragraph',
		`paragraph--${size}`,
		`paragraph--${color}`,
		className,
	);

	if (dangerouslySetInnerHTML) {
		return (
			<p className={baseClasses} dangerouslySetInnerHTML={dangerouslySetInnerHTML} {...props} />
		);
	}

	return (
		<p className={baseClasses} {...props}>
			{children}
		</p>
	);
};
