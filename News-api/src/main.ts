import { connectDb } from './config/database-config.ts';
import { log } from './utils/logger.ts';
import { initScheduling } from './services/news-service.ts';
import { startApp } from './app.ts';

/**
 * Точка входа приложения.
 * Инициализирует подключение к базе данных, восстанавливает отложенные задачи
 * и запускает HTTP-сервер.
 */
(async function main() {
	try {
		log.info('Инициализация приложения...');
		await connectDb();
		await initScheduling();
		await startApp();
	} catch (err) {
		log.error('Ошибка при запуске:', err);
		process.exit(1);
	}
})();
