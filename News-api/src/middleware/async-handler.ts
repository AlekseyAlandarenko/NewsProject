import { Request, Response, NextFunction, RequestHandler } from 'express';

/**
 * Обёртка для асинхронных обработчиков Express.
 * Перехватывает ошибки и передаёт их в middleware обработки ошибок.
 */
export const asyncHandler = (fn: RequestHandler): RequestHandler => {
	return (req: Request, res: Response, next: NextFunction): void => {
		Promise.resolve(fn(req, res, next)).catch(next);
	};
};
