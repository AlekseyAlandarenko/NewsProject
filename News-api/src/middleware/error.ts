import { ErrorRequestHandler, Request, Response, NextFunction } from 'express';
import { log } from '../utils/logger.ts';
import { config } from '../config/app-config.ts';
import { HTTP_STATUS } from '../config/constants.ts';

/**
 * Универсальный HTTP-ошибочный ответ
 */
export class HTTPError extends Error {
	statusCode: number;

	constructor(message: string, statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR) {
		super(message);
		this.statusCode = statusCode;
		Error.captureStackTrace?.(this, this.constructor);
	}
}

/**
 * Глобальный обработчик ошибок Express.
 * Формирует стандартный JSON-ответ и логирует ошибку.
 */
export const errorHandler: ErrorRequestHandler = (
	err,
	_req: Request,
	res: Response,
	_next: NextFunction,
) => {
	const status = err instanceof HTTPError ? err.statusCode : HTTP_STATUS.INTERNAL_SERVER_ERROR;
	const message = err.message || 'Внутренняя ошибка сервера';

	log.error(`[${status}] ${message}`);

	if (config.NODE_ENV === 'development' && err.stack) {
		log.debug(err.stack);
	}

	res.status(status).json({ error: message });
};
