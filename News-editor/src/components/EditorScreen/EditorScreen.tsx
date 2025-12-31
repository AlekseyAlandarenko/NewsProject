import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useRef, useState } from 'react';
import { useToast } from '../../context/ToastContext';
import { db } from '../../firebase';
import { ArticleBlock } from '../../interfaces/article.interface';
import { isBlockEmpty } from '../../utils/articleBlock.utils';
import { Editor } from '../Editor/Editor';
import { NotificationBell } from '../NotificationBell/NotificationBell';
import { Preview } from '../Preview/Preview';
import { Button } from '../UI/Button/Button';
import { Input } from '../UI/Input/Input';
import { Title } from '../UI/Title/Title';

import './EditorScreen.scss';

export const EditorScreen = () => {
	const [blocks, setBlocks] = useState<ArticleBlock[]>([]);
	const [title, setTitle] = useState('');
	const [showPreview, setShowPreview] = useState(false);
	const [titleError, setTitleError] = useState<string | null>(null);
	const [saving, setSaving] = useState(false);

	const { showToast } = useToast();
	const titleRef = useRef<HTMLInputElement | null>(null);

	const validate = () => {
		if (!title.trim()) {
			setTitleError('Введите заголовок');
			setTimeout(() => titleRef.current?.focus(), 0);
			return false;
		}

		const hasNonEmptyBlock = blocks.some((b) => !isBlockEmpty(b));

		if (!hasNonEmptyBlock) {
			showToast('error', 'Статья должна содержать хотя бы один непустой блок');
			return false;
		}

		setTitleError(null);
		return true;
	};

	const saveArticle = async () => {
		if (!validate()) return;

		setSaving(true);

		try {
			await addDoc(collection(db, 'articles'), {
				title: title.trim(),
				blocks,
				createdAt: serverTimestamp(),
				updatedAt: serverTimestamp(),
			});

			showToast('success', 'Статья успешно сохранена');

			setBlocks([]);
			setTitle('');
			setShowPreview(false);
		} catch {
			showToast('error', 'Ошибка при сохранении статьи');
		} finally {
			setSaving(false);
		}
	};

	return (
		<div className="editor-screen container">
			<div className="editor-screen__header">
				<div className="editor-screen__title">
					<Title level={1} color="primary">
						Редактор статей
					</Title>
				</div>

				<div className="editor-screen__actions">
					<NotificationBell />
				</div>
			</div>

			<div className="editor-screen__title-wrapper">
				<Input
					ref={titleRef}
					fullWidth
					placeholder="Введите заголовок статьи..."
					value={title}
					onChange={(e) => {
						setTitle(e.target.value);
						if (titleError) setTitleError(null);
					}}
					error={titleError || undefined}
				/>
			</div>

			<Editor blocks={blocks} onBlocksChange={setBlocks} />

			<div className="editor-screen__action-block">
				<div className="editor-screen__action-buttons">
					<Button isLoading={saving} onClick={saveArticle}>
						Сохранить
					</Button>
					<Button variant="outline" onClick={() => setShowPreview((v) => !v)}>
						{showPreview ? 'Скрыть предпросмотр' : 'Предпросмотр'}
					</Button>
				</div>
			</div>

			{showPreview && <Preview title={title} blocks={blocks} />}
		</div>
	);
};
