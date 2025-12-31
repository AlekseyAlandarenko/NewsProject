export type BlockType = 'text' | 'image' | 'quote' | 'code' | 'file';

export interface TextContent {
	html: string;
}

export interface ImageContent {
	url: string;
}

export interface QuoteContent {
	text: string;
}

export interface CodeContent {
	markdown: string;
}

export interface FileContent {
	url: string;
}

export type BlockContent = TextContent | ImageContent | QuoteContent | CodeContent | FileContent;

export interface ArticleBlock {
	id: string;
	type: BlockType;
	content: BlockContent;
}
