import { User, onAuthStateChanged } from 'firebase/auth';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../firebase';
import {
    signInWithEmail,
    signInWithGoogle,
    signOutUser,
    signUpWithEmail
} from '../utils/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signInWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<{ success: boolean; error?: string }>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signUp = async (email: string, password: string) => {
    const result = await signUpWithEmail(email, password);
    return result;
  };

  const signIn = async (email: string, password: string) => {
    const result = await signInWithEmail(email, password);
    return result;
  };

  const handleGoogleSignIn = async () => {
    const result = await signInWithGoogle();
    return result;
  };

  const handleSignOut = async () => {
    try {
      const result = await signOutUser();
      if (result.success) {
        // User is automatically signed out, no need for additional feedback
        // The onAuthStateChanged listener will update the user state
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      return { success: false, error: 'An error occurred during sign out' };
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    signUp,
    signIn,
    signInWithGoogle: handleGoogleSignIn,
    signOut: handleSignOut,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 