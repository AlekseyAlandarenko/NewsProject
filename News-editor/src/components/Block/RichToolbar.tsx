import { Button } from '../UI/Button/Button';

interface ToolbarProps {
	onBold: () => void;
	onItalic: () => void;
	onH2: () => void;
	onH3: () => void;
	onUL: () => void;
	onOL: () => void;
	onLink: () => void;
	onClear: () => void;
}

export const RichToolbar = ({
	onBold,
	onItalic,
	onH2,
	onH3,
	onUL,
	onOL,
	onLink,
	onClear,
}: ToolbarProps) => (
	<div className="block__toolbar">
		<Button onClick={onBold}>B</Button>
		<Button onClick={onItalic}>
			<i>i</i>
		</Button>
		<Button onClick={onH2}>H2</Button>
		<Button onClick={onH3}>H3</Button>
		<Button onClick={onUL}>•</Button>
		<Button onClick={onOL}>1.</Button>
		<Button onClick={onLink}>ссылка</Button>
		<Button onClick={onClear}>очистить</Button>
	</div>
);
