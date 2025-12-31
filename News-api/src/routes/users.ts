import { Router } from 'express';
import { requireLogin } from '../middleware/auth.ts';
import { registerUser, loginUser } from '../services/users-service.ts';
import { asyncHandler } from '../middleware/async-handler.ts';
import { requireFields } from '../middleware/validate.ts';

const usersRoutes = Router();

// ──────────────────────────────────────────────────────────────
// Публичные маршруты
// ──────────────────────────────────────────────────────────────

/**
 * POST /users/register
 * Регистрирует нового пользователя.
 */
usersRoutes.post(
	'/register',
	requireFields(['email', 'password', 'name']),
	asyncHandler(async (req, res) => {
		const result = await registerUser({
			email: req.body.email!,
			password: req.body.password!,
			name: req.body.name!,
		});
		res.json(result);
	}),
);

/**
 * POST /users/login
 * Выполняет вход пользователя по email и паролю.
 */
usersRoutes.post(
	'/login',
	requireFields(['email', 'password']),
	asyncHandler(async (req, res) => {
		const result = await loginUser({
			email: req.body.email!,
			password: req.body.password!,
		});
		res.json(result);
	}),
);

// ──────────────────────────────────────────────────────────────
// Защищённые маршруты
// ──────────────────────────────────────────────────────────────

usersRoutes.use(requireLogin);

/**
 * GET /users/profile
 * Возвращает данные текущего авторизованного пользователя.
 */
usersRoutes.get('/profile', (req, res) => {
	res.json(req.user);
});

export { usersRoutes };
