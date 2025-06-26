
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

// Initialiser Firebase Admin seulement si ce n'est pas déjà fait
let adminApp;
if (getApps().length === 0) {
  try {
    // En production, vous devriez utiliser des variables d'environnement sécurisées
    const serviceAccount = require('../../firebaseAdmin.json');
    
    adminApp = initializeApp({
      credential: cert(serviceAccount),
      projectId: serviceAccount.project_id
    });
  } catch (error) {
    console.error('Erreur lors de l\'initialisation de Firebase Admin:', error);
    throw error;
  }
} else {
  adminApp = getApps()[0];
}

export const adminAuth = getAuth(adminApp);
export const adminDb = getFirestore(adminApp);

export interface AdminUser {
  uid: string;
  email?: string;
  displayName?: string;
  photoURL?: string;
  emailVerified: boolean;
  disabled: boolean;
  metadata: {
    creationTime?: string;
    lastSignInTime?: string;
  };
  customClaims?: { [key: string]: any };
}

export const adminUserService = {
  async getAllUsers(maxResults = 1000): Promise<AdminUser[]> {
    try {
      const listUsersResult = await adminAuth.listUsers(maxResults);
      return listUsersResult.users.map(user => ({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        emailVerified: user.emailVerified,
        disabled: user.disabled,
        metadata: {
          creationTime: user.metadata.creationTime,
          lastSignInTime: user.metadata.lastSignInTime
        },
        customClaims: user.customClaims
      }));
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
      throw error;
    }
  },

  async getUserById(uid: string): Promise<AdminUser | null> {
    try {
      const user = await adminAuth.getUser(uid);
      return {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        emailVerified: user.emailVerified,
        disabled: user.disabled,
        metadata: {
          creationTime: user.metadata.creationTime,
          lastSignInTime: user.metadata.lastSignInTime
        },
        customClaims: user.customClaims
      };
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'utilisateur:', error);
      return null;
    }
  },

  async updateUser(uid: string, properties: {
    email?: string;
    displayName?: string;
    disabled?: boolean;
    emailVerified?: boolean;
  }): Promise<void> {
    try {
      await adminAuth.updateUser(uid, properties);
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
      throw error;
    }
  },

  async deleteUser(uid: string): Promise<void> {
    try {
      await adminAuth.deleteUser(uid);
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'utilisateur:', error);
      throw error;
    }
  },

  async setCustomClaims(uid: string, customClaims: { [key: string]: any }): Promise<void> {
    try {
      await adminAuth.setCustomUserClaims(uid, customClaims);
    } catch (error) {
      console.error('Erreur lors de la définition des claims personnalisés:', error);
      throw error;
    }
  }
};
