import jwt from 'jsonwebtoken';
import { HTTPError } from '../middleware/error.ts';
import { config } from '../config/app-config.ts';
import { HTTP_STATUS } from '../config/constants.ts';

/**
 * Payload, содержащий идентификатор и email пользователя.
 */
interface TokenPayload extends jwt.JwtPayload {
	id: string;
	email: string;
}

/**
 * Проверяет и декодирует JWT-токен.
 * Валидирует формат, подпись и payload.
 */
export function verifyToken(token: string | undefined): TokenPayload {
	if (!token) {
		throw new HTTPError('Токен отсутствует', HTTP_STATUS.UNAUTHORIZED);
	}

	try {
		const decoded = jwt.verify(token, config.JWT_SECRET!) as TokenPayload;

		if (!decoded.id || !decoded.email) {
			throw new HTTPError(
				'Некорректный токен: отсутствуют поля id/email',
				HTTP_STATUS.UNAUTHORIZED,
			);
		}

		return decoded;
	} catch (err: unknown) {
		if (err instanceof jwt.TokenExpiredError) {
			throw new HTTPError('Срок действия токена истёк', HTTP_STATUS.UNAUTHORIZED);
		}

		const msg = err instanceof Error ? err.message : 'Ошибка верификации токена';
		throw new HTTPError(`Невалидный токен: ${msg}`, HTTP_STATUS.UNAUTHORIZED);
	}
}
