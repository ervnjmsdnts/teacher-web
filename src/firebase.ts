import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { clientConfig } from './config';
import { getFirestore } from 'firebase/firestore';

// Initialize Firebase
const app = initializeApp(clientConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
