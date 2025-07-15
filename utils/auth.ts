import {
    AuthError,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
    User
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase';

// Password validation function
export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Email validation function
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Sign up with email and password
export const signUpWithEmail = async (email: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> => {
  try {
    // Validate email
    if (!validateEmail(email)) {
      return { success: false, error: 'Please enter a valid email address' };
    }
    
    // Validate password
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return { 
        success: false, 
        error: `Password validation failed:\n${passwordValidation.errors.join('\n')}` 
      };
    }
    
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error) {
    const authError = error as AuthError;
    let errorMessage = 'An error occurred during sign up';
    
    switch (authError.code) {
      case 'auth/email-already-in-use':
        errorMessage = 'An account with this email already exists';
        break;
      case 'auth/invalid-email':
        errorMessage = 'Invalid email address';
        break;
      case 'auth/weak-password':
        errorMessage = 'Password is too weak';
        break;
      case 'auth/operation-not-allowed':
        errorMessage = 'Email/password accounts are not enabled';
        break;
    }
    
    return { success: false, error: errorMessage };
  }
};

// Sign in with email and password
export const signInWithEmail = async (email: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error) {
    const authError = error as AuthError;
    let errorMessage = 'An error occurred during sign in';
    
    switch (authError.code) {
      case 'auth/user-not-found':
        errorMessage = 'No account found with this email address';
        break;
      case 'auth/wrong-password':
        errorMessage = 'Incorrect password';
        break;
      case 'auth/invalid-email':
        errorMessage = 'Invalid email address';
        break;
      case 'auth/user-disabled':
        errorMessage = 'This account has been disabled';
        break;
      case 'auth/too-many-requests':
        errorMessage = 'Too many failed attempts. Please try again later';
        break;
    }
    
    return { success: false, error: errorMessage };
  }
};

// Sign in with Google
export const signInWithGoogle = async (): Promise<{ success: boolean; user?: User; error?: string }> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return { success: true, user: result.user };
  } catch (error) {
    const authError = error as AuthError;
    let errorMessage = 'An error occurred during Google sign in';
    
    switch (authError.code) {
      case 'auth/popup-closed-by-user':
        errorMessage = 'Sign in was cancelled';
        break;
      case 'auth/popup-blocked':
        errorMessage = 'Pop-up was blocked by browser. Please allow pop-ups and try again';
        break;
      case 'auth/cancelled-popup-request':
        errorMessage = 'Sign in was cancelled';
        break;
      case 'auth/account-exists-with-different-credential':
        errorMessage = 'An account already exists with the same email address but different sign-in credentials';
        break;
    }
    
    return { success: false, error: errorMessage };
  }
};

// Sign out
export const signOutUser = async (): Promise<{ success: boolean; error?: string }> => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return { success: false, error: 'An error occurred during sign out' };
  }
};

// Get current user
export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return auth.currentUser !== null;
}; 