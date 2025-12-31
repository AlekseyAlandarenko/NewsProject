import { Schema, model, HydratedDocument, Model, Types } from 'mongoose';

/**
 * Интерфейс данных новости.
 */
export interface INews {
	_id: Types.ObjectId;
	title: string;
	content: string;
	authorId: Types.ObjectId;
	imagePath?: string;
	isPublished: boolean;
	publishDate?: Date;
	publishedAt?: Date;
	createdAt?: Date;
	updatedAt?: Date;
}

/**
 * Тип документа новости (HydratedDocument).
 */
export type NewsDocument = HydratedDocument<INews>;

/**
 * Интерфейс модели новости.
 */
interface NewsModel extends Model<INews> {}

const newsSchema = new Schema<INews, NewsModel>(
	{
		title: { type: String, required: true, trim: true, maxlength: 150 },
		content: { type: String, required: true, maxlength: 10000 },
		authorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
		imagePath: String,
		isPublished: { type: Boolean, default: false },
		publishDate: Date,
		publishedAt: Date,
	},
	{ timestamps: true },
);

/**
 * Хук перед сохранением документа.
 * При первой публикации автоматически устанавливает дату публикации.
 */
newsSchema.pre<NewsDocument>('save', function (next) {
	if (this.isModified('isPublished') && this.isPublished && !this.publishedAt) {
		this.publishedAt = new Date();
	}
	next();
});

/**
 * Индексы для оптимизации запросов.
 */
newsSchema.index({ authorId: 1 });
newsSchema.index({ isPublished: 1, publishDate: 1 });

export const News = model<INews, NewsModel>('News', newsSchema);
