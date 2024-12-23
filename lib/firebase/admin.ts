import "server-only";

import admin from "firebase-admin";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

interface FirebaseAdminAppParams {
  projectId: string;
  clientEmail: string;
  storageBucket: string;
  privateKey: string;
}

function formatPrivateKey(key: string) {
  return key.replace(/\\n/g, "\n");
}

export function createFirebaseAdminApp(params: FirebaseAdminAppParams) {
  const privateKey = formatPrivateKey(params.privateKey);

  // if already created, return the same instance
  if (admin.apps.length > 0) {
    return admin.app();
  }

  // else, create certificate
  const cert = admin.credential.cert({
    privateKey,
    projectId: params.projectId,
    clientEmail: params.clientEmail,
  });

  // and initialize the admin app
  return admin.initializeApp({
    credential: cert,
    projectId: params.projectId,
    storageBucket: params.storageBucket,
  });
}

export async function initializeAdmin() {
  const params = {
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID as string,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL as string,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET as string,
    privateKey: process.env.FIREBASE_PRIVATE_KEY as string,
  };

  return createFirebaseAdminApp(params);
}

export const adminFirebaseApp = await initializeAdmin();
export const adminFirebaseAuth = getAuth(adminFirebaseApp);
export const adminFirebaseDB = getFirestore(adminFirebaseApp);
export const adminFirebaseStorage = getStorage(adminFirebaseApp);
