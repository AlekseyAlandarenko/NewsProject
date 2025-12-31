import { HTTPError } from '../middleware/error.ts';
import { HTTP_STATUS } from '../config/constants.ts';
import { News } from '../models/News.ts';

/**
 * Возвращает новость, если она принадлежит пользователю.
 * Если новость существует, но принадлежит другому — выбрасывается ошибка 403.
 * Если не существует — выбрасывается ошибка 404.
 */
export async function getUserNewsById(id: string, authorId: string) {
	const news = await News.findById(id);

	if (!news) {
		throw new HTTPError('Новость не найдена', HTTP_STATUS.NOT_FOUND);
	}

	if (String(news.authorId) !== String(authorId)) {
		throw new HTTPError('Недостаточно прав для доступа к этой новости', HTTP_STATUS.FORBIDDEN);
	}

	return news;
}
