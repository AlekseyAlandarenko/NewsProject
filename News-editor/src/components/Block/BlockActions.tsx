import { ReactNode } from 'react';
import { Button } from '../UI/Button/Button';

interface BlockActionsProps {
	children?: ReactNode;
	onDelete: () => void;
	onMoveUp?: () => void;
	onMoveDown?: () => void;
	isFirst?: boolean;
	isLast?: boolean;
}

export const BlockActions = ({
	children,
	onDelete,
	onMoveUp,
	onMoveDown,
	isFirst,
	isLast,
}: BlockActionsProps) => (
	<div className="block__actions">
		{children}

		{onMoveUp && !isFirst && (
			<Button variant="outline" onClick={onMoveUp}>
				▲
			</Button>
		)}

		{onMoveDown && !isLast && (
			<Button variant="outline" onClick={onMoveDown}>
				▼
			</Button>
		)}

		<Button variant="danger" onClick={onDelete}>
			Удалить
		</Button>
	</div>
);
