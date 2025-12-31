import mongoose from 'mongoose';
import { log } from '../utils/logger.ts';
import { config } from './app-config.ts';

/**
 * Подключается к MongoDB с помощью mongoose.
 * При ошибке подключения приложение завершается.
 */
export async function connectDb(): Promise<void> {
	try {
		await mongoose.connect(config.MONGO_URI as string);
		log.info('Подключение к MongoDB установлено');
	} catch (err) {
		const message = err instanceof Error ? err.message : String(err);
		log.error(`Ошибка подключения к MongoDB: ${message}`);
		throw new Error(`Не удалось подключиться к MongoDB: ${message}`);
	}
}
