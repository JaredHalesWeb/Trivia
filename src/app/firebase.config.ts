// src/app/firebase.config.ts

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { environment } from '../environments/environment';

// ✅ Initialize the Firebase app once
const firebaseApp = initializeApp(environment.firebase);

// ✅ Export globally usable instances
export const firestore = getFirestore(firebaseApp);
export const auth = getAuth(firebaseApp);
