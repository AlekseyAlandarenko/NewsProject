import { useState } from 'react';
import { useToast } from '../../context/ToastContext';
import { useFileUpload } from '../../hooks/useFileUpload';
import { ArticleBlock, ImageContent, FileContent } from '../../interfaces/article.interface';
import { Button } from '../UI/Button/Button';
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

export const MediaBlock = ({
	block,
	onUpdate,
	onDelete,
	onMoveUp,
	onMoveDown,
	isFirst,
	isLast,
}: BlockProps) => {
	const isImage = block.type === 'image';
	const content = block.content as ImageContent | FileContent;
	const [src, setSrc] = useState(content.url || '');

	const { upload, loading } = useFileUpload();
	const { showToast } = useToast();

	const pushUpdate = (url: string) => {
		setSrc(url);
		onUpdate({
			...block,
			content: { url },
		});
	};

	const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		e.target.value = '';
		if (!file) return;

		try {
			const url = await upload(file);
			pushUpdate(url);
			showToast('success', 'Файл успешно загружен');
		} catch {
			showToast('error', 'Ошибка при загрузке');
		}
	};

	const filename = src ? decodeURIComponent(src.split('/').pop() || '') : '';

	return (
		<>
			{src && isImage && <img src={src} alt="Загруженное изображение" className="block__image" />}

			{src && !isImage && <p className="block__file-name">Файл: {filename}</p>}

			{loading && <p className="block__loading">Загрузка...</p>}

			<BlockActions
				onDelete={onDelete}
				onMoveUp={onMoveUp}
				onMoveDown={onMoveDown}
				isFirst={isFirst}
				isLast={isLast}
			>
				<label className="block__file-button btn btn--primary">
					<span>{src ? 'Заменить файл' : 'Выбрать файл'}</span>
					<input
						type="file"
						accept={isImage ? 'image/*' : '.pdf,.doc,.docx'}
						onChange={handleFile}
					/>
				</label>

				{src && (
					<Button variant="outline" onClick={() => pushUpdate('')}>
						Удалить файл
					</Button>
				)}
			</BlockActions>
		</>
	);
};
