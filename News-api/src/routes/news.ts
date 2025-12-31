import { Router } from 'express';
import { UploadedFile } from 'express-fileupload';
import { requireLogin } from '../middleware/auth.ts';
import {
	getPublishedNews,
	getPublishedNewsById,
	getUserNews,
	createNews,
	updateNews,
	deleteNews,
	publishNews,
} from '../services/news-service.ts';
import { getUserNewsById } from '../utils/get-user-news-by-id.ts';
import { asyncHandler } from '../middleware/async-handler.ts';
import { requireFields, validateId, validatePagination } from '../middleware/validate.ts';

/**
 * Извлекает первое загруженное изображение из req.files.
 *
 * Принимает файл или массив файлов.
 * Возвращает первый файл либо undefined.
 */
function getUploadedImage(
	image: UploadedFile | UploadedFile[] | undefined,
): UploadedFile | undefined {
	if (!image) return undefined;
	return Array.isArray(image) ? image[0] : image;
}

/**
 * Безопасно извлекает строковый параметр из Express (string | string[] | undefined).
 */
function getParam(value: string | string[] | undefined): string {
	if (Array.isArray(value)) return value[0];
	if (!value) throw new Error('Missing route param');
	return value;
}

const newsRoutes = Router();

// ──────────────────────────────────────────────────────────────
// Публичные маршруты
// ──────────────────────────────────────────────────────────────

/**
 * GET /news
 * Возвращает список опубликованных новостей с пагинацией.
 */
newsRoutes.get(
	'/',
	validatePagination,
	asyncHandler(async (req, res) => {
		const result = await getPublishedNews({
			page: String(req.query.page ?? ''),
			limit: String(req.query.limit ?? ''),
		});

		res.json(result);
	}),
);

/**
 * GET /news/:id
 * Возвращает одну опубликованную новость по ID.
 * (Пропускает маршрут, если запрашивается /news/my)
 */
newsRoutes.get(
	'/:id',
	(req, _res, next) => {
		if (req.params.id === 'my') return next('route');
		next();
	},
	validateId,
	asyncHandler(async (req, res) => {
		const id = getParam(req.params.id);
		const news = await getPublishedNewsById(id);
		res.json(news);
	}),
);

// ──────────────────────────────────────────────────────────────
// Защищённые маршруты (требуется авторизация)
// ──────────────────────────────────────────────────────────────

newsRoutes.use(requireLogin);

/**
 * POST /news
 * Создаёт новую новость.
 * Поддерживает JSON и multipart/form-data (с полем image).
 */
newsRoutes.post(
	'/',
	requireFields(['title', 'content']),
	asyncHandler(async (req, res) => {
		const imageFile = getUploadedImage(req.files?.image as UploadedFile | UploadedFile[]);
		const publishDate = req.body.publishDate ? new Date(req.body.publishDate) : undefined;
		const imageUrl = req.body.imageUrl ? String(req.body.imageUrl) : undefined;

		const news = await createNews(
			{
				title: String(req.body.title),
				content: String(req.body.content),
				publishDate,
				imageUrl,
			},
			req.user!.id,
			imageFile,
		);

		res.status(201).json(news);
	}),
);

/**
 * POST /news/:id/publish
 * Принудительно публикует новость (снимает отложенную публикацию).
 */
newsRoutes.post(
	'/:id/publish',
	validateId,
	asyncHandler(async (req, res) => {
		const id = getParam(req.params.id);
		const news = await publishNews(id, req.user!.id);
		res.json(news);
	}),
);

/**
 * GET /news/my
 * Возвращает все новости текущего пользователя с пагинацией.
 */
newsRoutes.get(
	'/my',
	validatePagination,
	asyncHandler(async (req, res) => {
		const result = await getUserNews(req.user!.id, {
			page: String(req.query.page ?? ''),
			limit: String(req.query.limit ?? ''),
		});

		res.json(result);
	}),
);

/**
 * GET /news/my/:id
 * Возвращает конкретную новость текущего пользователя по ID.
 */
newsRoutes.get(
	'/my/:id',
	validateId,
	asyncHandler(async (req, res) => {
		const id = getParam(req.params.id);
		const news = await getUserNewsById(id, req.user!.id);
		res.json(news);
	}),
);

/**
 * PATCH /news/:id
 * Частично обновляет новость.
 * Поддерживает замену изображения и изменение даты отложенной публикации.
 */
newsRoutes.patch(
	'/:id',
	validateId,
	asyncHandler(async (req, res) => {
		const id = getParam(req.params.id);

		const imageFile = getUploadedImage(req.files?.image as UploadedFile | UploadedFile[]);
		const publishDate = req.body.publishDate ? new Date(req.body.publishDate) : undefined;
		const imageUrl = req.body.imageUrl ? String(req.body.imageUrl) : undefined;

		const news = await updateNews(
			id,
			{ ...req.body, publishDate, imageUrl },
			req.user!.id,
			imageFile,
		);

		res.json(news);
	}),
);

/**
 * DELETE /news/:id
 * Удаляет новость и связанное с ней изображение.
 */
newsRoutes.delete(
	'/:id',
	validateId,
	asyncHandler(async (req, res) => {
		const id = getParam(req.params.id);
		await deleteNews(id, req.user!.id);
		res.json({ message: 'Удалено' });
	}),
);

export { newsRoutes };