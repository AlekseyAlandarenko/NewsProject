import DOMPurify from 'dompurify';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';
import {
	ArticleBlock,
	TextContent,
	QuoteContent,
	ImageContent,
	CodeContent,
	FileContent,
} from '../../interfaces/article.interface';
import { Paragraph } from '../UI/Paragraph/Paragraph';
import { Title } from '../UI/Title/Title';

import './Preview.scss';

const renderHtml = (html: string) => DOMPurify.sanitize(html, { USE_PROFILES: { html: true } });

const TextView = ({ block }: { block: ArticleBlock }) => {
	const { html } = block.content as TextContent;
	if (!html.trim()) return null;

	return <div className="preview__text" dangerouslySetInnerHTML={{ __html: renderHtml(html) }} />;
};

const QuoteView = ({ block }: { block: ArticleBlock }) => {
	const { text } = block.content as QuoteContent;
	return (
		<blockquote className="preview__quote">
			<Paragraph size="lg" color="muted">
				{text}
			</Paragraph>
		</blockquote>
	);
};

const ImageView = ({ block }: { block: ArticleBlock }) => {
	const { url } = block.content as ImageContent;
	return <img src={url} alt="" className="preview__image" />;
};

const CodeView = ({ block }: { block: ArticleBlock }) => {
	const { markdown } = block.content as CodeContent;
	return (
		<ReactMarkdown
			className="preview__code"
			remarkPlugins={[remarkGfm]}
			rehypePlugins={[rehypeHighlight]}
		>
			{markdown}
		</ReactMarkdown>
	);
};

const FileView = ({ block }: { block: ArticleBlock }) => {
	const { url } = block.content as FileContent;

	if (!url) return null;

	let filename = 'Файл';
	try {
		filename = decodeURIComponent(url.split('/').pop() || 'Файл');
	} catch {
		// fallback если decodeURIComponent упадёт
	}

	return (
		<a
			href={url}
			download
			target="_blank"
			rel="noopener noreferrer"
			className="preview__file"
			aria-label={`Скачать файл ${filename}`}
		>
			<Paragraph color="primary">Скачать файл: {filename}</Paragraph>
		</a>
	);
};

const renderBlock = (block: ArticleBlock) => {
	switch (block.type) {
		case 'text':
			return <TextView block={block} key={block.id} />;
		case 'image':
			return <ImageView block={block} key={block.id} />;
		case 'quote':
			return <QuoteView block={block} key={block.id} />;
		case 'code':
			return <CodeView block={block} key={block.id} />;
		case 'file':
			return <FileView block={block} key={block.id} />;
	}
};

export const Preview = ({ title, blocks }: { title: string; blocks: ArticleBlock[] }) => {
	const safeTitle = title.trim() || 'Без заголовка';

	return (
		<div className="preview">
			<Title level={1} color="primary">
				{safeTitle}
			</Title>

			{blocks.map(renderBlock)}
		</div>
	);
};
