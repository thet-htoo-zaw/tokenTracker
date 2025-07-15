# Firebase Setup Guide

## 🔥 Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Create a project"** or **"Add project"**
3. Enter project name: `crypto-tracker-app`
4. Enable Google Analytics (optional)
5. Click **"Create project"**

## 🔐 Step 2: Enable Authentication

1. In your Firebase project dashboard, click **"Authentication"** in the left sidebar
2. Click **"Get started"**
3. Go to the **"Sign-in method"** tab
4. Click on **"Email/Password"**
5. Enable **"Email/Password"** authentication
6. Click **"Save"**

## 📱 Step 3: Add Web App

1. Click the **gear icon** (⚙️) next to "Project Overview"
2. Select **"Project settings"**
3. Scroll down to **"Your apps"** section
4. Click the **web icon** (</>)
5. Enter app nickname: `crypto-tracker-web`
6. Click **"Register app"**
7. **Copy the Firebase config object** - it will look like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};
```

## 🔧 Step 4: Update Firebase Config

1. Open `firebase.ts` in your project
2. Replace the placeholder config with your actual Firebase config
3. Save the file

## 🧪 Step 5: Test Authentication

1. Run your app: `npm start`
2. Try to create a new account
3. Try to sign in with the created account
4. Check Firebase Console > Authentication > Users to see registered users

## 🔒 Security Rules (Optional)

If you plan to use Firestore later, set up security rules:

1. Go to **Firestore Database** in Firebase Console
2. Click **"Create database"**
3. Start in **test mode** for development
4. Later, update security rules as needed

## 🚀 Additional Features

### Enable Email Verification (Optional)
1. In Authentication > Sign-in method
2. Click **"Email/Password"**
3. Enable **"Email link (passwordless sign-in)"**
4. Add your domain to authorized domains

### Enable Password Reset (Optional)
1. In Authentication > Sign-in method
2. Click **"Email/Password"**
3. Enable **"Allow users to reset their password"**

## 📱 Testing the App

After setup:

1. **Sign Up**: Create a new account with email/password
2. **Sign In**: Login with your credentials
3. **Profile**: Check that user data is saved
4. **Favorites**: Test adding/removing favorite coins
5. **Balance**: Verify balance updates work

## 🔍 Troubleshooting

### Common Issues:

1. **"Firebase: Error (auth/invalid-api-key)"**
   - Check that your API key is correct in `firebase.ts`

2. **"Firebase: Error (auth/operation-not-allowed)"**
   - Make sure Email/Password authentication is enabled in Firebase Console

3. **"Firebase: Error (auth/network-request-failed)"**
   - Check your internet connection
   - Verify Firebase project is active

4. **App crashes on startup**
   - Check that all Firebase config values are filled in
   - Verify project ID matches your Firebase project

## 📞 Support

If you encounter issues:
1. Check Firebase Console for error logs
2. Verify all config values are correct
3. Ensure Authentication is properly enabled
4. Test with a simple email/password combination

## 🎯 Next Steps

Once Firebase is working:
1. Implement Buy screen with Stripe
2. Add Swap functionality
3. Create Search screen
4. Add Price Alerts
5. Implement Transaction History 