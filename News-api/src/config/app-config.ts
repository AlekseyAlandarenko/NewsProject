import dotenv from 'dotenv';

/**
 * Загружаем .env только при локальном запуске.
 * - В Docker: переменные передаются через env_file.
 * - В Render: переменные заданы в панели Environment.
 */
if (process.env.NODE_ENV !== 'production' && !process.env.DOCKER_ENV) {
	const result = dotenv.config();
	if (result.error) {
		console.warn('.env не найден (нормально для Docker или Render)');
	} else {
		console.log('Переменные окружения успешно загружены из .env');
	}
}

export const config = {
	PORT: process.env.PORT ?? '3000',
	MONGO_URI: process.env.MONGO_URI,
	JWT_SECRET: process.env.JWT_SECRET,
	ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS ?? '',
	NODE_ENV: process.env.NODE_ENV ?? 'development',
} as const;

// Проверка обязательных env
(['MONGO_URI', 'JWT_SECRET'] as const).forEach((key) => {
	if (!config[key]) throw new Error(`Отсутствует обязательная переменная окружения: ${key}`);
});
