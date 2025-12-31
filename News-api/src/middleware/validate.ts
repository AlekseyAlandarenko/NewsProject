import { Request, Response, NextFunction } from 'express';
import { HTTPError } from './error.ts';
import { HTTP_STATUS } from '../config/constants.ts';

/**
 * Проверяет, что в теле запроса присутствуют обязательные поля.
 */
export function requireFields(fields: string[]) {
	return (req: Request, _res: Response, next: NextFunction): void => {
		for (const field of fields) {
			const value = req.body[field];
			if (value === undefined || value === null || value === '') {
				return next(
					new HTTPError(`Поле "${field}" обязательно`, HTTP_STATUS.UNPROCESSABLE_ENTITY),
				);
			}
		}
		next();
	};
}

/**
 * Проверяет корректность ObjectId в параметрах URL.
 */
export function validateId(req: Request, _res: Response, next: NextFunction): void {
	const id = String(req.params.id ?? '');

	if (!/^[a-f\d]{24}$/i.test(id)) {
		return next(new HTTPError('Некорректный ObjectId', HTTP_STATUS.UNPROCESSABLE_ENTITY));
	}

	next();
}

/**
 * Проверяет, что query-параметры `page` и `limit` являются числами.
 */
export function validatePagination(req: Request, _res: Response, next: NextFunction): void {
	for (const key of ['page', 'limit'] as const) {
		const value = req.query[key];

		if (value !== undefined && !/^\d+$/.test(String(value))) {
			return next(
				new HTTPError(`${key} должен быть числом`, HTTP_STATUS.UNPROCESSABLE_ENTITY),
			);
		}
	}

	next();
}