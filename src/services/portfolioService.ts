import { PortfolioData, Message } from "../types";
import { db, auth } from "../firebase";
import { doc, getDoc, setDoc, collection, addDoc, serverTimestamp } from "firebase/firestore";

const DATA_DOC_PATH = "system/data";

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export const portfolioService = {
  async getData(): Promise<PortfolioData | null> {
    try {
      const docRef = doc(db, DATA_DOC_PATH);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return docSnap.data() as PortfolioData;
      } else {
        return null;
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, DATA_DOC_PATH);
      return null; // unreachable but for TS
    }
  },

  async updateData(data: PortfolioData): Promise<void> {
    try {
      const docRef = doc(db, DATA_DOC_PATH);
      await setDoc(docRef, data);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, DATA_DOC_PATH);
    }
  },

  async sendMessage(message: Omit<Message, 'id' | 'date'>): Promise<void> {
    const path = "messages";
    try {
      const messagesRef = collection(db, path);
      await addDoc(messagesRef, {
        ...message,
        date: new Date().toISOString(),
        createdAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  }
};
