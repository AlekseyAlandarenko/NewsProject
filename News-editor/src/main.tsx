import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ToastContainer } from './components/ToastContainer/ToastContainer';
import { ToastProvider } from './context/ToastContext';
import './App.scss';

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<ToastProvider>
			<App />
			<ToastContainer />
		</ToastProvider>
	</React.StrictMode>,
);
