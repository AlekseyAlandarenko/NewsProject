import { FileArray } from 'express-fileupload';

declare global {
	namespace Express {
		interface Request {
			/**
			 * Данные авторизованного пользователя (если есть).
			 */
			user?: {
				id: string;
				email: string;
			};

			/**
			 * Загруженные файлы (multipart/form-data).
			 */
			files?: FileArray;

			/**
			 * Тело HTTP-запроса.
			 * Используется для данных авторизации, новостей и других форм.
			 */
			body: {
				email?: string;
				password?: string;
				name?: string;
				title?: string;
				content?: string;
				publishDate?: string;
				[key: string]: any;
			};

			/**
			 * Параметры маршрута.
			 */
			params: {
				id?: string;
				[key: string]: string | undefined;
			};
		}
	}
}
