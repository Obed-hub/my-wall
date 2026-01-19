import { Post, MediaType, UserProfile, OperationResult } from '../types';
import { auth, db, storage } from '../firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile,
  User,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { 
  collection, 
  addDoc, 
  getDocs, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  orderBy 
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL 
} from 'firebase/storage';
import { compressImage } from './compression';

// Helper to map Firebase User to our UserProfile
const mapUser = (user: User): UserProfile => ({
  uid: user.uid,
  email: user.email,
  displayName: user.displayName || user.email?.split('@')[0] || 'User'
});

export const api = {
  // AUTHENTICATION

  // Google Login
  loginWithGoogle: async (): Promise<OperationResult<UserProfile>> => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      return { success: true, data: mapUser(result.user) };
    } catch (error: any) {
      console.error("Google Login Error:", error);
      return { success: false, error: error.message };
    }
  },

  // Login
  login: async (email: string, password: string): Promise<OperationResult<UserProfile>> => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return { success: true, data: mapUser(userCredential.user) };
    } catch (error: any) {
      console.error("Login Error:", error);
      return { success: false, error: error.message };
    }
  },

  // Register
  register: async (email: string, password: string): Promise<OperationResult<UserProfile>> => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // Set a default display name derived from email
      if (userCredential.user) {
        await updateProfile(userCredential.user, {
          displayName: email.split('@')[0]
        });
      }
      return { success: true, data: mapUser(userCredential.user) };
    } catch (error: any) {
      console.error("Register Error:", error);
      return { success: false, error: error.message };
    }
  },

  logout: async (): Promise<void> => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout Error:", error);
    }
  },

  getCurrentUser: async (): Promise<UserProfile | null> => {
    // We wrap onAuthStateChanged in a promise to get the initial state
    return new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        unsubscribe();
        if (user) {
          resolve(mapUser(user));
        } else {
          resolve(null);
        }
      });
    });
  },

  // DATA

  getPosts: async (): Promise<OperationResult<Post[]>> => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) throw new Error("Not authenticated");

      // Query posts only for the current user, ordered by newest first
      const q = query(
        collection(db, "posts"), 
        where("userId", "==", currentUser.uid),
        orderBy("createdAt", "desc")
      );
      
      const querySnapshot = await getDocs(q);
      const posts: Post[] = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Post));

      return { success: true, data: posts };
    } catch (error: any) {
      console.error("Get Posts Error:", error);
      return { success: false, error: error.message };
    }
  },

  createPost: async (content: string, mediaFile: File | null, mediaType: MediaType): Promise<OperationResult<Post>> => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) throw new Error("Not authenticated");

      let mediaUrl = undefined;
      let fileName = undefined;

      // 1. Handle File Upload
      if (mediaFile) {
        let fileToUpload = mediaFile;
        fileName = mediaFile.name;

        // Compress if it's an image
        if (mediaType === MediaType.IMAGE) {
           fileToUpload = await compressImage(mediaFile);
        }

        // Create a reference to 'uploads/<uid>/<timestamp>_<filename>'
        const storagePath = `${Date.now()}_${fileToUpload.name}`;
        const storageRef = ref(storage, `uploads/${currentUser.uid}/${storagePath}`);
        
        // Upload
        await uploadBytes(storageRef, fileToUpload);
        
        // Get URL
        mediaUrl = await getDownloadURL(storageRef);
      }

      const newPostData = {
        userId: currentUser.uid,
        content,
        mediaType,
        mediaUrl: mediaUrl || null,
        fileName: fileName || null,
        createdAt: Date.now(),
        aiEnhanced: false // Can be passed in if needed, defaulting false for now
      };

      // 2. Save Metadata to Firestore
      const docRef = await addDoc(collection(db, "posts"), newPostData);

      return { 
        success: true, 
        data: { id: docRef.id, ...newPostData } as Post 
      };

    } catch (e: any) {
      console.error("Create Post Error:", e);
      return { success: false, error: e.message };
    }
  },
  
  deletePost: async (postId: string): Promise<OperationResult<void>> => {
    try {
       await deleteDoc(doc(db, "posts", postId));
       return { success: true };
    } catch (e: any) {
      console.error("Delete Post Error:", e);
      return { success: false, error: e.message };
    }
  }
};