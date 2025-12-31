import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator, signInAnonymously } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';

const firebaseConfig = {
	apiKey: 'fake-api-key',
	projectId: 'news-editor-433a1',
	storageBucket: 'news-editor-433a1.appspot.com',
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);

const isLocal = location.hostname === 'localhost' || location.hostname === '127.0.0.1';

if (isLocal) {
	connectFirestoreEmulator(db, 'localhost', 8080);
	connectStorageEmulator(storage, 'localhost', 9199);

	connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });

	signInAnonymously(auth).catch((err) => {
		console.error('Ошибка при анонимном входе в Auth эмулятор:', err);
	});

	console.log('%cЭмуляторы Firestore + Storage + Auth активны', 'color: orange;');
} else {
	console.log('%cПодключение к реальному Firebase', 'color: green;');
}

export default app;
