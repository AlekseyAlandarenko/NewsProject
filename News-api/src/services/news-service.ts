import { UploadedFile } from 'express-fileupload';
import { News } from '../models/News.ts';
import { log } from '../utils/logger.ts';
import { HTTPError } from '../middleware/error.ts';
import { HTTP_STATUS, NEWS_EVENTS } from '../config/constants.ts';
import { PaginationQuery, paginate } from '../utils/pagination.ts';
import { ImageService } from './image-service.ts';
import { getIo } from '../config/socket.ts';
import { getUserNewsById } from '../utils/get-user-news-by-id.ts';

const imageService = new ImageService();

/**
 * Хранилище таймеров для отложенных публикаций.
 * Ключ — ID новости, значение — setTimeout.
 */
const timers = new Map<string, NodeJS.Timeout>();

/**
 * Отменяет отложенную публикацию новости, если она была запланирована.
 */
function cancelPublication(newsId: string): void {
	const timer = timers.get(newsId);
	if (timer) {
		clearTimeout(timer);
		timers.delete(newsId);
	}
}

/**
 * Планирует отложенную публикацию новости на указанную дату.
 */
function schedulePublication(newsId: string, publishDate: Date): void {
	const delay = publishDate.getTime() - Date.now();

	// Если дата уже в прошлом — не планируем
	if (delay <= 0) return;

	const timer = setTimeout(async () => {
		try {
			const news = await News.findById(newsId);

			if (!news || news.isPublished) return;
			if (news.publishDate && news.publishDate > new Date()) return;

			news.isPublished = true;
			news.publishedAt = new Date();
			news.publishDate = undefined;

			await news.save();

			getIo()?.emit(NEWS_EVENTS.PUBLISHED, news.toObject());
			log.info(`Новость опубликована по расписанию: ${newsId}`);
		} catch (err) {
			log.error('Ошибка отложенной публикации:', err);
		} finally {
			timers.delete(newsId);
		}
	}, delay);

	timers.set(newsId, timer);
}

/**
 * Обновляет состояние планировщика:
 * - отменяет старый таймер
 * - при необходимости создаёт новый
 */
function updatePublicationSchedule(newsId: string, publishDate?: Date): void {
	cancelPublication(newsId);

	if (publishDate) {
		schedulePublication(newsId, publishDate);
	}
}

/**
 * Восстанавливает задачи отложенной публикации при запуске сервера.
 */
export async function initScheduling(): Promise<void> {
	const pending = await News.find({
		isPublished: false,
		publishDate: { $ne: null },
	}).lean();

	for (const n of pending) {
		if (n._id && n.publishDate) {
			schedulePublication(String(n._id), n.publishDate);
		}
	}

	log.info(`Восстановлено отложенных публикаций: ${pending.length}`);
}

/**
 * Создаёт новую новость.
 */
export async function createNews(
	newsData: {
		title: string;
		content: string;
		publishDate?: Date;
		imageUrl?: string;
	},
	authorId: string,
	image?: UploadedFile,
) {
	let imagePath = newsData.imageUrl;

	if (image) {
		imagePath = await imageService.updateImage(undefined, image);
	}

	const news = new News({ ...newsData, authorId, imagePath });
	await news.save();

	updatePublicationSchedule(String(news._id), news.publishDate);

	return news;
}

/**
 * Обновляет новость.
 */
export async function updateNews(
	id: string,
	data: {
		title?: string;
		content?: string;
		publishDate?: Date;
		imageUrl?: string;
	},
	authorId: string,
	image?: UploadedFile,
) {
	const news = await getUserNewsById(id, authorId);

	let newPath = news.imagePath;

	if (image) {
		newPath = await imageService.updateImage(news.imagePath, image);
	} else if (data.imageUrl !== undefined) {
		newPath = data.imageUrl;
	}

	news.imagePath = newPath;
	news.set(data);

	await news.save();

	updatePublicationSchedule(String(news._id), news.publishDate);

	if (news.isPublished) {
		getIo()?.emit(NEWS_EVENTS.UPDATED, news.toObject());
	}

	return news;
}

/**
 * Возвращает опубликованные новости.
 */
export async function getPublishedNews(query: PaginationQuery) {
	const { page, limit, skip } = paginate(query);

	const [list, total] = await Promise.all([
		News.find({ isPublished: true }).sort({ publishedAt: -1 }).skip(skip).limit(limit).lean(),
		News.countDocuments({ isPublished: true }),
	]);

	return { data: list, total, page, limit };
}

/**
 * Возвращает опубликованную новость по ID.
 */
export async function getPublishedNewsById(id: string) {
	const news = await News.findById(id).lean();

	if (!news || !news.isPublished) {
		throw new HTTPError('Новость не найдена', HTTP_STATUS.NOT_FOUND);
	}

	return news;
}

/**
 * Возвращает новости пользователя.
 */
export async function getUserNews(userId: string, query: PaginationQuery) {
	const { page, limit, skip } = paginate(query);

	const [list, total] = await Promise.all([
		News.find({ authorId: userId }).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
		News.countDocuments({ authorId: userId }),
	]);

	return { data: list, total, page, limit };
}

/**
 * Публикует новость вручную.
 */
export async function publishNews(id: string, authorId: string) {
	const news = await getUserNewsById(id, authorId);

	cancelPublication(String(news._id));

	if (!news.isPublished) {
		news.isPublished = true;
		news.publishedAt = new Date();
		news.publishDate = undefined;

		await news.save();

		getIo()?.emit(NEWS_EVENTS.PUBLISHED, news.toObject());
	}

	return news;
}

/**
 * Удаляет новость.
 */
export async function deleteNews(id: string, authorId: string) {
	const news = await getUserNewsById(id, authorId);

	cancelPublication(String(news._id));

	if (news.imagePath) {
		await imageService.deleteImage(news.imagePath);
	}

	await News.deleteOne({ _id: id });

	getIo()?.emit(NEWS_EVENTS.DELETED, { id });

	return { message: 'Удалено' };
}
