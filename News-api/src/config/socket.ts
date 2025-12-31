import type { Server as SocketServer } from 'socket.io';

let io: SocketServer | null = null;

/**
 * Сохраняет экземпляр Socket.IO сервера для использования в сервисах.
 */
export const setIo = (instance: SocketServer): void => {
	io = instance;
};

/**
 * Возвращает сохранённый экземпляр Socket.IO сервера.
 * Если сервер не инициализирован — возвращается null.
 */
export const getIo = (): SocketServer | null => io;
