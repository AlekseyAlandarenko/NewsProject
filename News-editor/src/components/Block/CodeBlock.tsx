import { useState } from 'react';
import { ArticleBlock, CodeContent } from '../../interfaces/article.interface';
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

export const CodeBlock = ({
	block,
	onUpdate,
	onDelete,
	onMoveUp,
	onMoveDown,
	isFirst,
	isLast,
}: BlockProps) => {
	const content = block.content as CodeContent;
	const [value, setValue] = useState(content.markdown);

	const update = (next: string) => {
		setValue(next);
		onUpdate({
			...block,
			content: { markdown: next },
		});
	};

	return (
		<>
			<textarea
				className="block__textarea"
				value={value}
				onChange={(e) => update(e.target.value)}
				placeholder="Введите markdown / код..."
			/>

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
