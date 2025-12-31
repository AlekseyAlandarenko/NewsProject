import { useRef } from 'react';
import { ArticleBlock, QuoteContent } from '../../interfaces/article.interface';
import { BlockActions } from './BlockActions';

interface BlockProps {
	block: ArticleBlock;
	onUpdate: (updated: ArticleBlock) => void;
	onDelete: () => void;
	onMoveUp: () => void;
	onMoveDown: () => void;
	isFirst: boolean;
	isLast: boolean;
}

export const QuoteBlock = ({
	block,
	onUpdate,
	onDelete,
	onMoveUp,
	onMoveDown,
	isFirst,
	isLast,
}: BlockProps) => {
	const ref = useRef<HTMLQuoteElement | null>(null);
	const content = block.content as QuoteContent;

	const commit = () => {
		if (!ref.current) return;
		const value = ref.current.innerText.trim();
		onUpdate({
			...block,
			content: { text: value },
		});
	};

	return (
		<>
			<blockquote
				ref={ref}
				className="block__quote"
				contentEditable
				suppressContentEditableWarning
				data-placeholder="Введите цитату..."
				onBlur={commit}
			>
				{content.text}
			</blockquote>

			<BlockActions
				onDelete={onDelete}
				onMoveUp={onMoveUp}
				onMoveDown={onMoveDown}
				isFirst={isFirst}
				isLast={isLast}
			/>
		</>
	);
};
