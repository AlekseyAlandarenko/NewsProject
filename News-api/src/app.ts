import express from 'express';
import { createServer } from 'http';
import { Server as SocketServer } from 'socket.io';
import { WebSocketServer, WebSocket } from 'ws';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import { usersRoutes } from './routes/users.ts';
import { newsRoutes } from './routes/news.ts';
import { errorHandler } from './middleware/error.ts';
import { log } from './utils/logger.ts';
import { optionalAuth } from './middleware/auth.ts';
import { config } from './config/app-config.ts';
import { FILE_LIMITS, NEWS_EVENTS } from './config/constants.ts';
import { setIo } from './config/socket.ts';

/**
 * Запускает Express-приложение с Socket.IO и WebSocket (fallback для Insomnia).
 */
export async function startApp(): Promise<void> {
	const app = express();
	const server = createServer(app);
	const port = Number(config.PORT || 3000);

	/**
	 * Настраивает CORS на основе списка разрешённых доменов.
	 */
	const allowedOrigins = (config.ALLOWED_ORIGINS ?? '')
		.split(',')
		.map((o) => o.trim())
		.filter(Boolean);

	const corsOptions: cors.CorsOptions = {
		origin: (origin, callback) => {
			if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
			callback(new Error(`CORS: доступ запрещён для ${origin}`));
		},
		credentials: true,
		methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
		allowedHeaders: ['Content-Type', 'Authorization'],
	};

	app.use(cors(corsOptions));
	app.use(express.json());
	app.use(
		fileUpload({
			limits: { fileSize: FILE_LIMITS.MAX_SIZE },
			abortOnLimit: true,
			useTempFiles: false,
			createParentPath: true,
		}),
	);

	/**
	 * Отдаёт загруженные изображения из папки uploads.
	 */
	app.use('/uploads', express.static('uploads', { index: false }));

	/**
	 * Подключает опциональную авторизацию.
	 */
	app.use(optionalAuth);

	/**
	 * Регистрирует маршруты API.
	 */
	app.use('/users', usersRoutes);
	app.use('/news', newsRoutes);
	app.use(errorHandler);

	/**
	 * Инициализирует Socket.IO для реального времени.
	 */
	const io = new SocketServer(server, { cors: corsOptions });
	setIo(io);

	io.on('connection', (socket) => {
		log.info(`Socket.IO клиент подключён: ${socket.id}`);
		socket.on('disconnect', () => log.info(`Socket.IO клиент отключён: ${socket.id}`));
	});

	/**
	 * Инициализирует WebSocket-сервер для Insomnia.
	 */
	const wss = new WebSocketServer({ server, path: '/ws' });
	const wsClients = new Set<WebSocket>();

	wss.on('connection', (ws) => {
		log.info('Подключён WebSocket (Insomnia)');
		wsClients.add(ws);
		ws.send(JSON.stringify({ message: 'Соединение установлено с WebSocket (/ws)' }));

		ws.on('close', () => {
			log.info('WebSocket (Insomnia) отключён');
			wsClients.delete(ws);
		});
	});

	/**
	 * Ретранслирует события Socket.IO в WebSocket-клиенты.
	 */
	const broadcastToWs = (event: string, data: any) => {
		for (const client of wsClients) {
			if (client.readyState === client.OPEN) {
				client.send(JSON.stringify({ event, data }));
			}
		}
	};

	/**
	 * Перехватывает io.emit для отправки событий в WebSocket.
	 */
	const socketEmit = io.emit.bind(io);
	io.emit = ((event: string, ...args: any[]) => {
		if ((Object.values(NEWS_EVENTS) as string[]).includes(event)) {
			broadcastToWs(event, args[0]);
		}
		return socketEmit(event, ...args);
	}) as any;

	/**
	 * Запускает HTTP-сервер.
	 */
	const url = `http://localhost:${port}`;
	server.listen(port, () => log.info(`Сервер запущен на ${url} (${config.NODE_ENV} mode)`));

	/**
	 * Корректно завершает работу по сигналам SIGINT и SIGTERM.
	 */
	['SIGINT', 'SIGTERM'].forEach((signal) => {
		process.once(signal, () => {
			log.info(`Получен сигнал ${signal}, выполняется завершение работы...`);
			io.close();
			wss.close();
			server.close(() => process.exit(0));
		});
	});
}
