import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { useState } from 'react';
import { storage } from '../firebase';

const MAX_FILE_SIZE = 10 * 1024 * 1024;

export const useFileUpload = () => {
	const [loading, setLoading] = useState(false);

	const upload = async (file: File): Promise<string> => {
		if (file.size > MAX_FILE_SIZE) {
			throw new Error('Файл слишком большой (максимум 10MB)');
		}

		setLoading(true);
		try {
			const fileRef = ref(storage, `uploads/${Date.now()}_${file.name}`);
			const snapshot = await uploadBytes(fileRef, file);
			const url = await getDownloadURL(snapshot.ref);
			return url;
		} finally {
			setLoading(false);
		}
	};

	return { upload, loading };
};
