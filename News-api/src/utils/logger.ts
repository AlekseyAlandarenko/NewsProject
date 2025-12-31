import { Logger } from 'tslog';
import { config } from '../config/app-config.ts';

/**
 * Настраивает экземпляр логгера.
 * Использует tslog и отключает позиции в продакшене.
 */
const loggerInstance = new Logger({
	hideLogPositionForProduction: true,
	name: 'NewsApp',
});

const isDev = config.NODE_ENV === 'development';

/**
 * Унифицированный логгер приложения.
 *
 * Поддерживает уровни:
 * - info — информационные сообщения
 * - warn — предупреждения
 * - error — ошибки
 * - debug — только в режиме development
 */
export const log = {
	/**
	 * Логирует информационные сообщения.
	 */
	info: (...args: unknown[]) => loggerInstance.info(...args),

	/**
	 * Логирует предупреждения.
	 */
	warn: (...args: unknown[]) => loggerInstance.warn(...args),

	/**
	 * Логирует ошибки.
	 */
	error: (...args: unknown[]) => loggerInstance.error(...args),

	/**
	 * Логирует отладочную информацию.
	 * Включено только в режиме development.
	 */
	debug: (...args: unknown[]) => {
		if (isDev) loggerInstance.debug(...args);
	},
};
