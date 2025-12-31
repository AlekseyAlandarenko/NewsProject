import { ArticleBlock, BlockType, BlockContent } from '../../interfaces/article.interface';
import { Block } from '../Block/Block';
import { Button } from '../UI/Button/Button';
import './Editor.scss';

interface EditorProps {
	blocks: ArticleBlock[];
	onBlocksChange: (next: ArticleBlock[]) => void;
}

const createContent = (type: BlockType): BlockContent => {
	switch (type) {
		case 'text':
			return { html: '' };
		case 'quote':
			return { text: '' };
		case 'code':
			return { markdown: '' };
		case 'image':
		case 'file':
			return { url: '' };
		default:
			return { html: '' };
	}
};

export const Editor = ({ blocks, onBlocksChange }: EditorProps) => {
	const addBlock = (type: BlockType) => {
		const draft: ArticleBlock = {
			id: crypto.randomUUID(),
			type,
			content: createContent(type),
		};

		onBlocksChange([...blocks, draft]);
	};

	const updateBlock = (id: string, updated: ArticleBlock) => {
		onBlocksChange(blocks.map((b) => (b.id === id ? updated : b)));
	};

	const removeBlock = (id: string) => {
		onBlocksChange(blocks.filter((b) => b.id !== id));
	};

	const moveBlock = (id: string, direction: 'up' | 'down') => {
		const index = blocks.findIndex((b) => b.id === id);
		if (index === -1) return;

		if (direction === 'up' && index > 0) {
			const next = [...blocks];
			[next[index - 1], next[index]] = [next[index], next[index - 1]];
			onBlocksChange(next);
		}

		if (direction === 'down' && index < blocks.length - 1) {
			const next = [...blocks];
			[next[index + 1], next[index]] = [next[index], next[index + 1]];
			onBlocksChange(next);
		}
	};

	return (
		<div className="editor">
			{blocks.map((b, index) => (
				<Block
					key={b.id}
					block={b}
					onUpdate={(u) => updateBlock(b.id, u)}
					onDelete={() => removeBlock(b.id)}
					onMoveUp={() => moveBlock(b.id, 'up')}
					onMoveDown={() => moveBlock(b.id, 'down')}
					isFirst={index === 0}
					isLast={index === blocks.length - 1}
				/>
			))}

			<div className="editor__add-buttons">
				<Button onClick={() => addBlock('text')}>Добавить текст</Button>
				<Button onClick={() => addBlock('image')}>Добавить изображение</Button>
				<Button onClick={() => addBlock('quote')}>Добавить цитату</Button>
				<Button onClick={() => addBlock('code')}>Добавить код</Button>
				<Button onClick={() => addBlock('file')}>Добавить файл</Button>
			</div>
		</div>
	);
};
