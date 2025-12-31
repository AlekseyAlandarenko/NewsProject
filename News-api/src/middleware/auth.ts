import { Request, Response, NextFunction } from 'express';
import { log } from '../utils/logger.ts';
import { HTTPError } from './error.ts';
import { HTTP_STATUS } from '../config/constants.ts';
import { config } from '../config/app-config.ts';
import { verifyToken } from '../utils/jwt.ts';

/**
 * Опциональная аутентификация.
 *
 * Если заголовок Authorization отсутствует — запрос пропускается.
 * Если заголовок есть — токен валидируется и данные пользователя
 * сохраняются в req.user.
 *
 * Используется для публичных маршрутов, где авторизация необязательна.
 */
export function optionalAuth(req: Request, _res: Response, next: NextFunction): void {
	const authHeader = req.headers.authorization;
	if (!authHeader) return next();

	const [scheme, token] = authHeader.trim().split(/\s+/);

	if (scheme !== 'Bearer') {
		return next(
			new HTTPError('Некорректный формат заголовка авторизации', HTTP_STATUS.UNAUTHORIZED),
		);
	}

	try {
		const { id, email } = verifyToken(token);
		req.user = { id, email };

		if (config.NODE_ENV === 'development') {
			log.info(`Аутентифицирован пользователь: ${email}`);
		}
	} catch (err) {
		return next(err);
	}

	next();
}

/**
 * Обязательная авторизация.
 *
 * Проверяет, что пользователь уже аутентифицирован (req.user существует).
 * Если нет — выбрасывается ошибка 401.
 *
 * Используется для защищённых маршрутов (создание, редактирование новостей и т.д.).
 */
export function requireLogin(req: Request, _res: Response, next: NextFunction): void {
	if (!req.user) {
		return next(new HTTPError('Вы не авторизованы!', HTTP_STATUS.UNAUTHORIZED));
	}
	next();
}
