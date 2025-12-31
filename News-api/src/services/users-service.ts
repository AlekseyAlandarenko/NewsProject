import jwt from 'jsonwebtoken';
import { User, UserDocument } from '../models/User.ts';
import { log } from '../utils/logger.ts';
import { HTTPError } from '../middleware/error.ts';
import { config } from '../config/app-config.ts';
import { HTTP_STATUS } from '../config/constants.ts';

/**
 * Формирует объект ответа с JWT-токеном и публичными данными пользователя.
 */
function toAuthPayload(user: UserDocument) {
	const token = jwt.sign(
		{ email: user.email, id: user._id.toString() },
		config.JWT_SECRET as string,
		{ expiresIn: '1d' },
	);

	return {
		token,
		user: {
			id: user._id,
			email: user.email,
			name: user.name,
			createdAt: user.createdAt,
		},
	};
}

/**
 * Регистрирует нового пользователя.
 * Если email уже занят — выбрасывается ошибка 422.
 */
export async function registerUser(userData: { email: string; password: string; name: string }) {
	const { email, password, name } = userData;

	if (await User.findOne({ email })) {
		throw new HTTPError('Email уже занят', HTTP_STATUS.UNPROCESSABLE_ENTITY);
	}

	const user = await new User({ email, password, name }).save();
	log.info(`Зарегистрирован: ${email}`);

	return toAuthPayload(user);
}

/**
 * Выполняет вход пользователя по email и паролю.
 * Если данные неверны — выбрасывается ошибка 401.
 */
export async function loginUser(loginData: { email: string; password: string }) {
	const { email, password } = loginData;

	const user = await User.findOne({ email }).select('+password');
	const isMatch = user && (await user.checkPassword(password));

	if (!isMatch) {
		throw new HTTPError('Неверный email или пароль', HTTP_STATUS.UNAUTHORIZED);
	}

	log.info(`Вошёл: ${email}`);
	return toAuthPayload(user);
}
