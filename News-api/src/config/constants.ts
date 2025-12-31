/**
 * Ограничения для загружаемых файлов.
 */
export const FILE_LIMITS = {
	MAX_SIZE: 5 * 1024 * 1024,
	ALLOWED_MIME_TYPES: ['image/jpeg', 'image/png', 'image/gif'],
	ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.gif'],
} as {
	MAX_SIZE: number;
	ALLOWED_MIME_TYPES: string[];
	ALLOWED_EXTENSIONS: string[];
};

/**
 * Настройки пагинации.
 */
export const PAGINATION = {
	DEFAULT_LIMIT: 10,
	MAX_LIMIT: 100,
} as const;

/**
 * События Socket.IO для новостей.
 */
export const NEWS_EVENTS = {
	PUBLISHED: 'news:published',
	UPDATED: 'news:updated',
	DELETED: 'news:deleted',
} as const;

/**
 * HTTP-статусы, используемые в приложении.
 */
export const HTTP_STATUS = {
	UNAUTHORIZED: 401,
	FORBIDDEN: 403,
	NOT_FOUND: 404,
	UNPROCESSABLE_ENTITY: 422,
	INTERNAL_SERVER_ERROR: 500,
} as const;
