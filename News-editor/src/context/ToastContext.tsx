import { createContext, useContext, useRef, useState } from 'react';

export type ToastType = 'success' | 'error';

export interface Toast {
	id: string;
	type: ToastType;
	message: string;
	duration?: number;
}

interface ToastContextValue {
	toasts: Toast[];
	showToast: (type: ToastType, message: string, duration?: number) => void;
	removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
	const [toasts, setToasts] = useState<Toast[]>([]);
	const timeouts = useRef<Record<string, number>>({});

	const removeToast = (id: string) => {
		setToasts((prev) => prev.filter((t) => t.id !== id));

		if (timeouts.current[id]) {
			clearTimeout(timeouts.current[id]);
			delete timeouts.current[id];
		}
	};

	const showToast = (type: ToastType, message: string, duration = 3000) => {
		const id = crypto.randomUUID();
		const toast: Toast = { id, type, message, duration };

		setToasts((prev) => [...prev, toast]);

		timeouts.current[id] = window.setTimeout(() => {
			removeToast(id);
		}, duration);
	};

	return (
		<ToastContext.Provider value={{ toasts, showToast, removeToast }}>
			{children}
		</ToastContext.Provider>
	);
};

export const useToast = () => {
	const ctx = useContext(ToastContext);
	if (!ctx) throw new Error('useToast должен использоваться внутри ToastProvider');
	return ctx;
};
