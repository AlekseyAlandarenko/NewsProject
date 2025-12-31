import { ArticleBlock } from '../../interfaces/article.interface';
import { CodeBlock } from './CodeBlock';
import { MediaBlock } from './MediaBlock';
import { QuoteBlock } from './QuoteBlock';
import { TextBlock } from './TextBlock';
import './Block.scss';

interface BlockProps {
	block: ArticleBlock;
	onUpdate: (updated: ArticleBlock) => void;
	onDelete: () => void;
	onMoveUp: () => void;
	onMoveDown: () => void;
	isFirst: boolean;
	isLast: boolean;
}

export const Block = ({
	block,
	onUpdate,
	onDelete,
	onMoveUp,
	onMoveDown,
	isFirst,
	isLast,
}: BlockProps) => {
	const shared = { block, onUpdate, onDelete, onMoveUp, onMoveDown, isFirst, isLast };

	return (
		<div className="block">
			{block.type === 'text' && <TextBlock {...shared} />}
			{(block.type === 'image' || block.type === 'file') && <MediaBlock {...shared} />}
			{block.type === 'quote' && <QuoteBlock {...shared} />}
			{block.type === 'code' && <CodeBlock {...shared} />}
		</div>
	);
};
