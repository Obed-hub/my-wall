/**
 * Cloudinary Upload Service
 * Handles file uploads to Cloudinary instead of Firebase Storage
 */

interface CloudinaryUploadResponse {
  secure_url: string;
  public_id: string;
  format: string;
  resource_type: string;
  bytes: number;
}

interface UploadResult {
  success: boolean;
  url?: string;
  publicId?: string;
  error?: string;
}

/**
 * Upload a file to Cloudinary using unsigned upload
 * @param file - The file to upload
 * @returns Promise with upload result containing URL or error
 */
export const uploadToCloudinary = async (file: File): Promise<UploadResult> => {
  try {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      console.error('Missing Cloudinary configuration. Please check your .env.local file.');
      return {
        success: false,
        error: 'Cloudinary not configured. Please add VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET to .env.local'
      };
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);
    formData.append('folder', 'my-wall');

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/upload`,
      {
        method: 'POST',
        body: formData
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Cloudinary upload failed:', errorData);
      return {
        success: false,
        error: errorData.error?.message || 'Upload failed'
      };
    }

    const data: CloudinaryUploadResponse = await response.json();

    return {
      success: true,
      url: data.secure_url,
      publicId: data.public_id // expose public ID for later deletion
    };

  } catch (error: any) {
    console.error('Cloudinary upload error:', error);
    return {
      success: false,
      error: error.message || 'Upload failed'
    };
  }
};

/**
 * Delete a file from Cloudinary using its public ID.
 * 
 * IMPORTANT NOTE: Cloudinary's delete API requires authentication which needs
 * the API secret. For security, this should NEVER be exposed in client-side code.
 * 
 * RECOMMENDED APPROACH:
 * 1. Create a Firebase Cloud Function or backend endpoint
 * 2. That endpoint receives the publicId and performs the authenticated delete
 * 3. Update this function to call your backend endpoint instead
 * 
 * For now, we'll just log the deletion intent. Files will remain in Cloudinary
 * until you implement the backend deletion endpoint.
 */
export const deleteFromCloudinary = async (publicId: string): Promise<boolean> => {
  console.log(`[Cloudinary Delete] Would delete file with publicId: ${publicId}`);
  console.log('⚠️  To enable actual deletion, implement a backend endpoint for Cloudinary delete API');

  // TODO: Replace this with a call to your backend endpoint
  // Example:
  // const response = await fetch('/api/cloudinary/delete', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ publicId })
  // });
  // return response.ok;

  // For now, return true to indicate the post can still be deleted from Firestore
  return true;
};

/**
 * Get optimized image URL from Cloudinary
 * @param url - Original Cloudinary URL
 * @param width - Desired width (optional)
 * @param quality - Quality (auto, best, good, eco, low)
 * @returns Optimized URL
 */
export const getOptimizedImageUrl = (
  url: string,
  width?: number,
  quality: 'auto' | 'best' | 'good' | 'eco' | 'low' = 'auto'
): string => {
  if (!url || !url.includes('cloudinary.com')) {
    return url; // Return original if not a Cloudinary URL
  }

  // Extract the upload path
  const uploadIndex = url.indexOf('/upload/');
  if (uploadIndex === -1) return url;

  const beforeUpload = url.substring(0, uploadIndex + 8);
  const afterUpload = url.substring(uploadIndex + 8);

  // Build transformation string
  const transformations: string[] = [];

  if (width) {
    transformations.push(`w_${width}`);
    transformations.push('c_limit'); // Limit to width, maintain aspect ratio
  }

  transformations.push(`q_${quality}`);
  transformations.push('f_auto'); // Auto format (WebP when supported)

  const transformString = transformations.join(',');

  return `${beforeUpload}${transformString}/${afterUpload}`;
};
