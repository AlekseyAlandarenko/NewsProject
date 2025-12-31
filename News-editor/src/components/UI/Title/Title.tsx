import classNames from 'classnames';
import { ReactNode, HTMLAttributes } from 'react';
import './Title.scss';

interface TitleProps extends HTMLAttributes<HTMLHeadingElement> {
	level?: 1 | 2 | 3;
	color?: 'default' | 'muted' | 'primary';
	children?: ReactNode;
}

export const Title = ({
	level = 1,
	children,
	color = 'default',
	className,
	...props
}: TitleProps) => {
	const Tag: 'h1' | 'h2' | 'h3' = `h${level}`;

	return (
		<Tag
			className={classNames('title', `title--h${level}`, `title--${color}`, className)}
			{...props}
		>
			{children}
		</Tag>
	);
};
