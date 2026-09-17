import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { initializeFirestore, getFirestore, doc, getDocFromServer, setDoc, getDoc, Firestore } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

/* CRITICAL: initializeFirestore with experimentalAutoDetectLongPolling enables reliable connection
   in iframe sandboxes, container proxies, and corporate networks without 10-second stream timeouts. */
let firestoreDb: Firestore;
try {
  firestoreDb = initializeFirestore(app, {
    experimentalAutoDetectLongPolling: true,
  }, firebaseConfig.firestoreDatabaseId);
} catch {
  firestoreDb = getFirestore(app, firebaseConfig.firestoreDatabaseId);
}

export const db = firestoreDb;
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export const PLATFORM_OWNER_EMAIL = 'timbest0612@gmail.com';

export function isPlatformOwner(email?: string | null): boolean {
  if (!email) return false;
  return email.trim().toLowerCase() === PLATFORM_OWNER_EMAIL.toLowerCase();
}

export async function signInWithGoogleAccount() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    const isOwner = isPlatformOwner(user.email);

    // Sync or save user profile to Firestore
    try {
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      const existing = userSnap.exists() ? userSnap.data() : null;

      const now = new Date().toISOString();
      const trialDurationDays = 14;
      const trialExpiresAt = new Date(Date.now() + trialDurationDays * 24 * 60 * 60 * 1000).toISOString();

      await setDoc(userRef, {
        id: user.uid,
        email: user.email || '',
        fullName: user.displayName || user.email?.split('@')[0] || 'Apex User',
        avatarUrl: user.photoURL || '',
        isSuperAdmin: isOwner,
        plan: isOwner ? 'AGENCY' : (existing?.plan || 'TRIAL_SANDBOX'),
        role: isOwner ? 'OWNER' : (existing?.role || 'OWNER'),
        trialStartedAt: existing?.trialStartedAt || now,
        trialExpiresAt: isOwner ? new Date(Date.now() + 3650 * 24 * 60 * 60 * 1000).toISOString() : (existing?.trialExpiresAt || trialExpiresAt),
        createdAt: existing?.createdAt || now,
        updatedAt: now,
      }, { merge: true });
    } catch (firestoreErr) {
      console.warn('Could not sync user profile to firestore (continuing auth):', firestoreErr);
    }

    return user;
  } catch (error) {
    console.error('Google Sign-In Error:', error);
    throw error;
  }
}

export async function signOutUser() {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Sign Out Error:', error);
    throw error;
  }
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export async function testConnection(): Promise<boolean> {
  try {
    const fetchDocPromise = getDocFromServer(doc(db, 'test', 'connection'));
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Firebase connection check timed out; continuing in resilient offline mode')), 6000)
    );
    await Promise.race([fetchDocPromise, timeoutPromise]);
    console.log('Connected to persistent Firebase Firestore');
    return true;
  } catch (error) {
    if (error instanceof Error) {
      console.info('Firebase Firestore operating in resilient/offline mode:', error.message);
    }
    return false;
  }
}

// Initial connection check
testConnection().catch(() => {});
