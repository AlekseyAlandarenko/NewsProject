import { useRef } from 'react';
import { useToast } from '../../context/ToastContext';
import { useContentEditableSync } from '../../hooks/useContentEditableSync';
import { ArticleBlock, TextContent } from '../../interfaces/article.interface';
import { isValidHttpUrl } from '../../utils/articleBlock.utils';
import { BlockActions } from './BlockActions';
import { RichToolbar } from './RichToolbar';

interface BlockProps {
	block: ArticleBlock;
	onUpdate: (updated: ArticleBlock) => void;
	onDelete: () => void;
	onMoveUp: () => void;
	onMoveDown: () => void;
	isFirst: boolean;
	isLast: boolean;
}

export const TextBlock = ({
	block,
	onUpdate,
	onDelete,
	onMoveUp,
	onMoveDown,
	isFirst,
	isLast,
}: BlockProps) => {
	const ref = useRef<HTMLDivElement | null>(null);
	const { showToast } = useToast();

	const html = (block.content as TextContent).html || '';
	useContentEditableSync(ref, html);

	const commit = () => {
		const el = ref.current;
		if (!el) return;

		const next = el.innerHTML.trim();
		if (next !== html.trim()) {
			onUpdate({
				...block,
				content: { html: next },
			});
		}
	};

	const command = (cmd: string, value?: string) => {
		document.execCommand(cmd, false, value);
		commit();
	};

	const applyLink = () => {
		const url = prompt('Введите ссылку', 'https://');
		if (!url || !isValidHttpUrl(url)) {
			showToast('error', 'Введите корректный URL');
			return;
		}
		command('createLink', url);
	};

	return (
		<>
			<RichToolbar
				onBold={() => command('bold')}
				onItalic={() => command('italic')}
				onH2={() => command('formatBlock', 'h2')}
				onH3={() => command('formatBlock', 'h3')}
				onUL={() => command('insertUnorderedList')}
				onOL={() => command('insertOrderedList')}
				onLink={applyLink}
				onClear={() => {
					if (!ref.current) return;
					const plain = ref.current.innerText.replace(/\n/g, '<br>');
					ref.current.innerHTML = plain;
					commit();
				}}
			/>

			<div
				ref={ref}
				className="block__editor"
				contentEditable
				suppressContentEditableWarning
				onInput={commit}
				onBlur={commit}
				data-placeholder="Введите текст..."
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
