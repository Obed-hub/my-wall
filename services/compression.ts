/**
 * Enhanced File Compression Service
 * Optimizes images, videos, and other files to reduce data and memory usage
 */

/**
 * Compresses an image file by resizing and reducing quality.
 * Aggressively optimizes to keep files under 500KB for better performance.
 */
export const compressImage = async (
  file: File,
  maxWidth = 1920,
  quality = 0.75
): Promise<File> => {
  return new Promise((resolve, reject) => {
    if (!file.type.match(/image.*/)) {
      resolve(file);
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const elem = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions
        if (width > maxWidth) {
          height *= maxWidth / width;
          width = maxWidth;
        }

        elem.width = width;
        elem.height = height;

        const ctx = elem.getContext('2d');
        if (!ctx) {
          reject(new Error("Could not get canvas context"));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Compress to Blob with adaptive quality
        ctx.canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Compression failed"));
              return;
            }

            // If still too large, reduce quality further
            if (blob.size > 500000 && quality > 0.5) {
              compressImage(file, maxWidth, quality - 0.1).then(resolve).catch(reject);
              return;
            }

            const compressedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          },
          'image/jpeg',
          quality
        );
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};

/**
 * Optimizes file based on type
 * - Images: Compressed and resized
 * - Videos: Size check and warning
 * - Documents: Pass through (already compressed formats)
 */
export const optimizeFile = async (file: File): Promise<File> => {
  const fileType = file.type;

  // Image optimization
  if (fileType.startsWith('image/')) {
    return await compressImage(file);
  }

  // Video size check (warn if > 50MB)
  if (fileType.startsWith('video/')) {
    const maxVideoSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxVideoSize) {
      console.warn(`Video file ${file.name} is ${(file.size / 1024 / 1024).toFixed(2)}MB. Consider compressing it before upload.`);
    }
    return file;
  }

  // Audio files - pass through
  if (fileType.startsWith('audio/')) {
    return file;
  }

  // Documents and other files - pass through
  return file;
};

/**
 * Format file size for display
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Validate file size (max 100MB per file)
 */
export const validateFileSize = (file: File, maxSizeMB = 100): boolean => {
  const maxSize = maxSizeMB * 1024 * 1024;
  return file.size <= maxSize;
};