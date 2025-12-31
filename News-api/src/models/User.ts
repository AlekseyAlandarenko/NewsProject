import { Schema, model, Model, HydratedDocument, Types } from 'mongoose';
import { hash, compare } from 'bcryptjs';

/**
 * Интерфейс данных пользователя.
 */
export interface IUser {
	_id: Types.ObjectId;
	email: string;
	password: string;
	name: string;
	createdAt?: Date;
}

/**
 * Методы экземпляра пользователя.
 */
export interface IUserMethods {
	/**
	 * Проверяет соответствие введённого пароля хешу в базе.
	 */
	checkPassword(password: string): Promise<boolean>;
}

/**
 * Тип документа пользователя (HydratedDocument).
 */
export type UserDocument = HydratedDocument<IUser, IUserMethods>;

/**
 * Интерфейс модели пользователя.
 */
interface UserModel extends Model<IUser, {}, IUserMethods> {}

const userSchema = new Schema<IUser, UserModel, IUserMethods>(
	{
		email: { type: String, required: true, unique: true, lowercase: true, trim: true },
		password: { type: String, required: true, select: false },
		name: { type: String, required: true, trim: true },
	},
	{ timestamps: { createdAt: true, updatedAt: false } },
);

/**
 * Хук перед сохранением документа.
 * При изменении пароля выполняется его хеширование.
 */
userSchema.pre<UserDocument>('save', async function (next) {
	if (this.isModified('password')) {
		this.password = await hash(this.password, 10);
	}
	next();
});

/**
 * Проверяет пароль пользователя.
 * Сравнивает введённое значение с хешем в базе.
 */
userSchema.methods.checkPassword = async function (password: string): Promise<boolean> {
	if (!this.password) throw new Error('Password not selected from database');
	return compare(password, this.password);
};

export const User = model<IUser, UserModel>('User', userSchema);
