export enum MediaType {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  AUDIO = 'AUDIO',
  DOCUMENT = 'DOCUMENT',
  OTHER = 'OTHER'
}

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
}

export interface Post {
  id: string;
  userId: string;
  content: string; // The text content or caption
  mediaType: MediaType;
  mediaUrl?: string; // URL for image or video
  fileName?: string; // Original filename for documents
  createdAt: number; // Timestamp
  aiEnhanced?: boolean; // If text was polished by Gemini
}

export type Theme = 'light' | 'dark';

// Helper for results
export interface OperationResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}