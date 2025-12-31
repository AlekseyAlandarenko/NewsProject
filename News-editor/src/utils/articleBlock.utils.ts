import {
	ArticleBlock,
	TextContent,
	QuoteContent,
	ImageContent,
	FileContent,
	CodeContent,
} from '../interfaces/article.interface';

export const isBlockEmpty = (block: ArticleBlock): boolean => {
	switch (block.type) {
		case 'text':
			return !(block.content as TextContent).html.trim();
		case 'quote':
			return !(block.content as QuoteContent).text.trim();
		case 'image':
		case 'file':
			return !(block.content as ImageContent | FileContent).url.trim();
		case 'code':
			return !(block.content as CodeContent).markdown.trim();
		default:
			return true;
	}
};

export const isValidHttpUrl = (url: string) => /^https?:\/\//i.test(url);
