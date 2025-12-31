import { collection, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { BellIcon } from './BellIcon';
import './NotificationBell.scss';

export const NotificationBell = () => {
	const [messages, setMessages] = useState<string[]>([]);
	const [unread, setUnread] = useState(0);
	const [open, setOpen] = useState(false);

	useEffect(() => {
		let initial = true;

		const unsub = onSnapshot(collection(db, 'articles'), (snapshot) => {
			if (initial) {
				initial = false;
				return;
			}

			snapshot.docChanges().forEach((change) => {
				const data = change.doc.data();
				const title = data.title || 'Без заголовка';

				const typeMap: Record<string, string> = {
					added: 'Добавлена',
					modified: 'Обновлена',
				};

				const action = typeMap[change.type];
				if (!action) return;

				const timestamp = new Date();
				const date = new Intl.DateTimeFormat('ru-RU').format(timestamp);
				const time = timestamp.toLocaleTimeString('ru-RU');

				const msg = `${action} статья «${title}» (${date}, ${time})`;

				setMessages((prev) => [msg, ...prev].slice(0, 50));
				if (!open) setUnread((n) => n + 1);
			});
		});

		return () => unsub();
	}, [open]);

	const toggle = () => {
		setOpen((state) => !state);
		if (!open) setUnread(0);
	};

	return (
		<div className="bell">
			<button className="bell__button" onClick={toggle}>
				<BellIcon />
				{unread > 0 && <span className="bell__count">{unread}</span>}
			</button>

			{open && (
				<div className="bell__panel">
					{messages.length === 0 ? (
						<p className="bell__empty">Нет уведомлений</p>
					) : (
						<ul>
							{messages.map((msg, idx) => (
								<li className="bell__item" key={idx}>
									{msg}
								</li>
							))}
						</ul>
					)}
				</div>
			)}
		</div>
	);
};
