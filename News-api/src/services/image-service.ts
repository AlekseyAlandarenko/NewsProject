import * as path from 'path';
import * as fs from 'fs/promises';
import { UploadedFile } from 'express-fileupload';
import { log } from '../utils/logger.ts';
import { HTTPError } from '../middleware/error.ts';
import { FILE_LIMITS, HTTP_STATUS } from '../config/constants.ts';

/**
 * Сервис для загрузки, удаления и обновления изображений.
 */
export class ImageService {
	/** Возвращает абсолютный путь к папке uploads */
	private getUploadsDir(): string {
		return path.resolve(process.cwd(), 'uploads');
	}

	/**
	 * Сохраняет загруженное изображение на диск.
	 * Проверяет формат и расширение файла.
	 * При неверном формате — выбрасывается ошибка 422.
	 * Возвращает относительный путь для сохранения в базе данных.
	 */
	async uploadImage(file: UploadedFile): Promise<string> {
		const ext = path.extname(file.name).toLowerCase();

		if (
			!FILE_LIMITS.ALLOWED_MIME_TYPES.includes(file.mimetype) ||
			!FILE_LIMITS.ALLOWED_EXTENSIONS.includes(ext)
		) {
			throw new HTTPError(
				`Допустимые форматы: ${FILE_LIMITS.ALLOWED_EXTENSIONS.join(', ')}`,
				HTTP_STATUS.UNPROCESSABLE_ENTITY,
			);
		}

		await fs.mkdir(this.getUploadsDir(), { recursive: true });

		const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
		const fileName = `${Date.now()}-${safeName}`;
		const filePath = path.join(this.getUploadsDir(), fileName);
		const imagePath = `/uploads/${fileName}`;

		try {
			await fs.writeFile(filePath, Buffer.from(file.data));
		} catch (err) {
			const msg = err instanceof Error ? err.message : String(err);
			log.error(`Ошибка при записи файла ${fileName}: ${msg}`);
			throw new HTTPError('Не удалось сохранить изображение', HTTP_STATUS.UNPROCESSABLE_ENTITY);
		}

		log.info(`Загружено изображение: ${fileName}`);
		return imagePath;
	}

	/**
	 * Удаляет изображение с диска, если путь указан.
	 * Если файл уже удалён — ошибка игнорируется.
	 */
	async deleteImage(imagePath?: string): Promise<void> {
		if (!imagePath) return;

		const filePath = path.join(this.getUploadsDir(), path.basename(imagePath));
		try {
			await fs.unlink(filePath);
			log.info(`Удалено изображение: ${imagePath}`);
		} catch {
			// Файл уже удалён — игнорируем
		}
	}

	/**
	 * Обновляет изображение.
	 * Если передан новый файл — старый удаляется, новый сохраняется.
	 * Если новый файл не передан — возвращается старый путь.
	 */
	async updateImage(oldPath?: string, newFile?: UploadedFile): Promise<string | undefined> {
		if (!newFile) return oldPath;

		const newPath = await this.uploadImage(newFile);
		if (oldPath) await this.deleteImage(oldPath);
		return newPath;
	}
}
