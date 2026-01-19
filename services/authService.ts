
import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  updateProfile,
  signOut, 
  onAuthStateChanged,
  User
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAyBKG3XXmgNvk6KzpsXWYtA3Gebls2iCs",
  authDomain: "aspiranthq-3e00d.firebaseapp.com",
  projectId: "aspiranthq-3e00d",
  storageBucket: "aspiranthq-3e00d.firebasestorage.app",
  messagingSenderId: "210080019034",
  appId: "1:210080019034:web:cd55a4443bec970ef0de63",
  measurementId: "G-Y4R8RH5YRD"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export interface UserSession {
  user: {
    email: string | null;
    name: string | null;
    rank: string;
    uid: string;
  };
}

export const authService = {
  async login(email: string, pass: string): Promise<UserSession> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, pass);
      const user = userCredential.user;
      return {
        user: {
          email: user.email,
          name: user.displayName || "Officer Aspirant",
          rank: "Officer Cadet",
          uid: user.uid
        }
      };
    } catch (error: any) {
      console.error("Auth error:", error.code);
      let message = "Access Denied: Strategic Registry Error.";
      
      // auth/invalid-credential is the modern Firebase catch-all for invalid user/pass
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
        message = "Identity Verification Failed. If you are a new candidate, please click 'Enlist Now' below to register your profile.";
      } else if (error.code === 'auth/invalid-email') {
        message = "Credential Format Error: The email address provided is malformed.";
      } else if (error.code === 'auth/too-many-requests') {
        message = "Security Protocol: Too many failed attempts. Access temporarily locked for your protection.";
      }
      
      throw new Error(message);
    }
  },

  async register(name: string, email: string, pass: string): Promise<UserSession> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
      await updateProfile(userCredential.user, { displayName: name });
      
      const user = userCredential.user;
      return {
        user: {
          email: user.email,
          name: name,
          rank: "Officer Cadet",
          uid: user.uid
        }
      };
    } catch (error: any) {
      console.error("Registration error:", error.code);
      let message = "Registration Failure: Internal Registry Error.";
      if (error.code === 'auth/email-already-in-use') {
        message = "This identity is already active in our database. Please proceed to the Login portal.";
      } else if (error.code === 'auth/weak-password') {
        message = "Access Key security violation: Password must be at least 6 characters.";
      } else if (error.code === 'auth/invalid-email') {
        message = "Credential Format Error: Invalid email address.";
      }
      throw new Error(message);
    }
  },

  async logout(): Promise<void> {
    await signOut(auth);
  },

  onAuthUpdate(callback: (session: UserSession | null) => void) {
    return onAuthStateChanged(auth, (user: User | null) => {
      if (user) {
        callback({
          user: {
            email: user.email,
            name: user.displayName || "Officer Aspirant",
            rank: "Officer Cadet",
            uid: user.uid
          }
        });
      } else {
        callback(null);
      }
    });
  }
};
