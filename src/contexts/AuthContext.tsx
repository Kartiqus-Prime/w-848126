
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  User, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
  updateProfile,
  updatePassword
} from 'firebase/auth';
import { auth, googleProvider, isFirebaseConfigured } from '@/lib/firebase';
import { userService } from '@/lib/firestore';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  signUp: (email: string, password: string, displayName?: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  sendVerificationEmail: () => Promise<void>;
  updateUserProfile: (displayName: string) => Promise<void>;
  updateUserPassword: (newPassword: string) => Promise<void>;
  isConfigured: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const signUp = async (email: string, password: string, displayName?: string) => {
    if (!isFirebaseConfigured) {
      throw new Error('Firebase n\'est pas configuré. Veuillez configurer vos clés Firebase.');
    }
    
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Mettre à jour le profil avec le nom d'affichage
      if (displayName && userCredential.user) {
        await updateProfile(userCredential.user, { displayName });
      }
      
      // Envoyer l'email de vérification d'abord
      if (userCredential.user) {
        await sendEmailVerification(userCredential.user);
      }
      
      // Créer le profil utilisateur dans Firestore avec retry logic
      if (userCredential.user) {
        const maxRetries = 3;
        let retries = 0;
        
        while (retries < maxRetries) {
          try {
            await userService.createProfile(userCredential.user.uid, {
              displayName: displayName || '',
              email: email,
              photoURL: userCredential.user.photoURL || undefined,
              role: 'user',
              preferences: {
                dietaryRestrictions: [],
                favoriteCategories: []
              }
            });
            console.log('User profile created successfully');
            break;
          } catch (error) {
            retries++;
            console.log(`Attempt ${retries} to create user profile failed:`, error);
            if (retries === maxRetries) {
              console.error('Failed to create user profile after maximum retries');
              // Ne pas faire échouer l'inscription pour autant
            } else {
              // Attendre un peu avant de réessayer
              await new Promise(resolve => setTimeout(resolve, 1000));
            }
          }
        }
      }
    } catch (error) {
      console.error('Error during sign up:', error);
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    if (!isFirebaseConfigured) {
      throw new Error('Firebase n\'est pas configuré. Veuillez configurer vos clés Firebase.');
    }
    await signInWithEmailAndPassword(auth, email, password);
  };

  const loginWithGoogle = async () => {
    if (!isFirebaseConfigured) {
      throw new Error('Firebase n\'est pas configuré. Veuillez configurer vos clés Firebase.');
    }
    
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      
      // Vérifier si l'utilisateur existe déjà dans Firestore
      if (userCredential.user) {
        let existingProfile = null;
        
        try {
          existingProfile = await userService.getProfile(userCredential.user.uid);
        } catch (error) {
          console.log('Error checking existing profile - user may be offline:', error);
        }
        
        if (!existingProfile) {
          // Créer le profil utilisateur avec le rôle 'user' si il n'existe pas
          try {
            await userService.createProfile(userCredential.user.uid, {
              displayName: userCredential.user.displayName || '',
              email: userCredential.user.email || '',
              photoURL: userCredential.user.photoURL || undefined,
              role: 'user',
              preferences: {
                dietaryRestrictions: [],
                favoriteCategories: []
              }
            });
            console.log('Google user profile created successfully');
          } catch (error) {
            console.error('Failed to create Google user profile - may be offline:', error);
          }
        }
      }
    } catch (error) {
      console.error('Error during Google login:', error);
      throw error;
    }
  };

  const logout = async () => {
    if (!isFirebaseConfigured) {
      throw new Error('Firebase n\'est pas configuré. Veuillez configurer vos clés Firebase.');
    }
    await signOut(auth);
  };

  const resetPassword = async (email: string) => {
    if (!isFirebaseConfigured) {
      throw new Error('Firebase n\'est pas configuré. Veuillez configurer vos clés Firebase.');
    }
    await sendPasswordResetEmail(auth, email);
  };

  const sendVerificationEmail = async () => {
    if (!isFirebaseConfigured) {
      throw new Error('Firebase n\'est pas configuré. Veuillez configurer vos clés Firebase.');
    }
    if (currentUser) {
      await sendEmailVerification(currentUser);
    }
  };

  const updateUserProfile = async (displayName: string) => {
    if (!isFirebaseConfigured) {
      throw new Error('Firebase n\'est pas configuré. Veuillez configurer vos clés Firebase.');
    }
    if (currentUser) {
      await updateProfile(currentUser, { displayName });
      // Mettre à jour aussi dans Firestore
      try {
        await userService.updateProfile(currentUser.uid, { displayName });
      } catch (error) {
        console.error('Error updating profile in Firestore - may be offline:', error);
      }
    }
  };

  const updateUserPassword = async (newPassword: string) => {
    if (!isFirebaseConfigured) {
      throw new Error('Firebase n\'est pas configuré. Veuillez configurer vos clés Firebase.');
    }
    if (currentUser) {
      await updatePassword(currentUser, newPassword);
    }
  };

  useEffect(() => {
    if (!isFirebaseConfigured) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Vérifier et créer le profil utilisateur si nécessaire
        try {
          const profile = await userService.getProfile(user.uid);
          if (!profile) {
            console.log('User profile not found, creating one...');
            await userService.createProfile(user.uid, {
              displayName: user.displayName || '',
              email: user.email || '',
              photoURL: user.photoURL || undefined,
              role: 'user',
              preferences: {
                dietaryRestrictions: [],
                favoriteCategories: []
              }
            });
          }
        } catch (error) {
          console.error('Error checking/creating user profile - may be offline:', error);
          // Ne pas empêcher la connexion si offline
        }
      }
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    loading,
    signUp,
    login,
    loginWithGoogle,
    logout,
    resetPassword,
    sendVerificationEmail,
    updateUserProfile,
    updateUserPassword,
    isConfigured: isFirebaseConfigured
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
