import { useEffect, useRef } from 'react';

export const useContentEditableSync = (ref: React.RefObject<HTMLElement>, content: string) => {
	const last = useRef(content);

	useEffect(() => {
		const el = ref.current;
		if (!el) return;

		const next = content.trim();
		const current = el.innerHTML.trim();

		if (next === current || last.current === next) return;

		const sel = window.getSelection();
		let range: Range | null = null;

		if (sel?.rangeCount) {
			range = sel.getRangeAt(0).cloneRange();
		}

		const normalized = next.replace(/<div>/g, '<p>').replace(/<\/div>/g, '</p>');

		el.innerHTML = normalized;
		last.current = next;

		if (range && sel) {
			try {
				sel.removeAllRanges();
				sel.addRange(range);
			} catch {
				// В редких случаях восстановление невозможно — игнорируем
			}
		}
	}, [content, ref]);
};
