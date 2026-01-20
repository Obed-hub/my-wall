import { Post, MediaType, UserProfile, OperationResult } from '../types';
import { auth, db } from '../firebase';
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
  getDoc,
  query,
  where,
  orderBy
} from 'firebase/firestore';
import { compressImage } from './compression';
import { uploadToCloudinary, deleteFromCloudinary } from './cloudinary';

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

  createPost: async (content: string, mediaFiles: File[] | null, mediaType: MediaType): Promise<OperationResult<Post>> => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) throw new Error("Not authenticated");

      let mediaUrl = undefined;
      let fileName = undefined;
      const uploadedFiles: any[] = [];

      // 1. Handle Multiple File Uploads to Cloudinary
      if (mediaFiles && mediaFiles.length > 0) {
        // Limit to 7 files
        const filesToUpload = mediaFiles.slice(0, 7);

        for (const file of filesToUpload) {
          let fileToUpload = file;
          const fileType = file.type;

          // Optimize file based on type
          if (fileType.startsWith('image/')) {
            fileToUpload = await compressImage(file);
          }

          // Upload to Cloudinary
          const uploadResult = await uploadToCloudinary(fileToUpload);

          if (!uploadResult.success) {
            throw new Error(uploadResult.error || `Failed to upload ${file.name}`);
          }

          // Determine media type for this file
          let fileMediaType = MediaType.OTHER;
          if (fileType.startsWith('image/')) fileMediaType = MediaType.IMAGE;
          else if (fileType.startsWith('video/')) fileMediaType = MediaType.VIDEO;
          else if (fileType.startsWith('audio/')) fileMediaType = MediaType.AUDIO;
          else if (fileType.includes('pdf') || fileType.includes('document') || fileType.includes('text/')) {
            fileMediaType = MediaType.DOCUMENT;
          }

          uploadedFiles.push({
            url: uploadResult.url,
            type: fileMediaType,
            fileName: file.name,
            size: file.size,
            publicId: uploadResult.publicId
          });
        }

        // For backward compatibility, set first file as primary
        if (uploadedFiles.length > 0) {
          mediaUrl = uploadedFiles[0].url;
          fileName = uploadedFiles[0].fileName;
        }
      }

      const newPostData = {
        userId: currentUser.uid,
        content,
        mediaType,
        mediaUrl: mediaUrl || null,
        fileName: fileName || null,
        mediaFiles: uploadedFiles.length > 0 ? uploadedFiles : null,
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
      // Step 1: Fetch the post to get file metadata
      const postRef = doc(db, "posts", postId);
      const postSnap = await getDoc(postRef);

      if (!postSnap.exists()) {
        return { success: false, error: "Post not found" };
      }

      const postData = postSnap.data() as Post;

      // Step 2: Delete files from Cloudinary (if any)
      if (postData.mediaFiles && postData.mediaFiles.length > 0) {
        console.log(`🗑️ Deleting ${postData.mediaFiles.length} file(s) from Cloudinary...`);

        for (const mediaFile of postData.mediaFiles) {
          if (mediaFile.publicId) {
            const deleted = await deleteFromCloudinary(mediaFile.publicId);
            if (deleted) {
              console.log(`✅ Deleted: ${mediaFile.fileName}`);
            } else {
              console.warn(`⚠️ Failed to delete: ${mediaFile.fileName}`);
            }
          }
        }
      }

      // Step 3: Delete the Firestore document
      await deleteDoc(postRef);
      console.log('✅ Post deleted successfully from Firestore');

      return { success: true };
    } catch (e: any) {
      console.error("Delete Post Error:", e);
      return { success: false, error: e.message };
    }
  }
};