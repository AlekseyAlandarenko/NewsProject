import { PAGINATION } from '../config/constants.ts';

/**
 * Query-параметры пагинации из HTTP-запроса.
 */
export interface PaginationQuery {
	page?: string;
	limit?: string;
}

/**
 * Нормализованные параметры пагинации.
 */
export interface PaginationResult {
	page: number;
	limit: number;
	skip: number;
}

/**
 * Нормализует параметры пагинации.
 * Приводит значения к числам и применяет ограничения.
 */
export function paginate(query: PaginationQuery): PaginationResult {
	const page = Math.max(1, Number(query.page) || 1);
	const limit = Math.max(
		1,
		Math.min(Number(query.limit) || PAGINATION.DEFAULT_LIMIT, PAGINATION.MAX_LIMIT),
	);

	return { page, limit, skip: (page - 1) * limit };
}
