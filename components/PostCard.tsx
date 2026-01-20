import React, { useState } from 'react';
import { Post, MediaType, MediaFile } from '../types';
import { formatFileSize } from '../services/compression';

interface PostCardProps {
  post: Post;
  onDelete: (id: string) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onDelete }) => {
  const [selectedImage, setSelectedImage] = useState<number>(0);

  const dateStr = new Date(post.createdAt).toLocaleDateString(undefined, {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  // Use new mediaFiles array if available, otherwise fallback to legacy single file
  const mediaFiles: MediaFile[] = post.mediaFiles || (post.mediaUrl ? [{
    url: post.mediaUrl,
    type: post.mediaType,
    fileName: post.fileName || 'file',
    size: 0
  }] : []);

  const hasMultipleFiles = mediaFiles.length > 1;
  const images = mediaFiles.filter(f => f.type === MediaType.IMAGE);
  const videos = mediaFiles.filter(f => f.type === MediaType.VIDEO);
  const audios = mediaFiles.filter(f => f.type === MediaType.AUDIO);
  const documents = mediaFiles.filter(f => f.type === MediaType.DOCUMENT || f.type === MediaType.OTHER);

  // Helper to get file icon
  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (ext === 'pdf') return 'fa-file-pdf';
    if (['doc', 'docx'].includes(ext || '')) return 'fa-file-word';
    if (['xls', 'xlsx'].includes(ext || '')) return 'fa-file-excel';
    if (['zip', 'rar', '7z'].includes(ext || '')) return 'fa-file-zipper';
    return 'fa-file-lines';
  };

  return (
    <div className="break-inside-avoid mb-6 bg-white dark:bg-dark-800 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border border-gray-100 dark:border-gray-700 group">

      {/* Image Gallery */}
      {images.length > 0 && (
        <div className="w-full">
          {/* Main Image */}
          <div className="relative w-full aspect-auto max-h-96 overflow-hidden bg-gray-100 dark:bg-gray-900">
            <img
              src={images[selectedImage].url}
              alt={`Image ${selectedImage + 1}`}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            {images.length > 1 && (
              <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                {selectedImage + 1} / {images.length}
              </div>
            )}
          </div>

          {/* Image Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-2 p-2 bg-gray-50 dark:bg-gray-900 overflow-x-auto">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${selectedImage === idx
                      ? 'border-brand-500 ring-2 ring-brand-200'
                      : 'border-gray-200 dark:border-gray-700 hover:border-brand-300'
                    }`}
                >
                  <img src={img.url} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Videos */}
      {videos.map((video, idx) => (
        <div key={`video-${idx}`} className="relative w-full aspect-video bg-black">
          <video src={video.url} controls className="w-full h-full" />
        </div>
      ))}

      {/* Audio Files */}
      {audios.length > 0 && (
        <div className="p-4 bg-gray-50 dark:bg-gray-900 border-b border-gray-100 dark:border-gray-700 space-y-2">
          {audios.map((audio, idx) => (
            <div key={`audio-${idx}`} className="space-y-1">
              <p className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-2">
                <i className="fas fa-music"></i>
                {audio.fileName}
              </p>
              <audio src={audio.url} controls className="w-full" />
            </div>
          ))}
        </div>
      )}

      {/* Documents & Other Files */}
      {documents.length > 0 && (
        <div className="p-4 bg-gray-50 dark:bg-gray-900 border-b border-gray-100 dark:border-gray-700 space-y-2">
          {documents.map((doc, idx) => (
            <a
              key={`doc-${idx}`}
              href={doc.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 bg-white dark:bg-dark-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors shadow-sm"
            >
              <div className={`${doc.type === MediaType.DOCUMENT ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-500' : 'bg-gray-100 dark:bg-gray-700 text-gray-500'} p-2.5 rounded-lg`}>
                <i className={`fas ${getFileIcon(doc.fileName)} text-lg`}></i>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                  {doc.fileName}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  {doc.size && doc.size > 0 && (
                    <span className="text-xs text-gray-500">{formatFileSize(doc.size)}</span>
                  )}
                  <span className="text-xs text-gray-400">• Tap to download</span>
                  <i className="fas fa-download text-[10px] text-gray-400"></i>
                </div>
              </div>
            </a>
          ))}
        </div>
      )}

      {/* Text Content */}
      <div className="p-4">
        {post.content && (
          <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap text-sm leading-relaxed">
            {post.content}
          </p>
        )}

        {/* Footer info */}
        <div className="mt-4 flex items-center justify-between text-xs text-gray-400 border-t border-gray-100 dark:border-gray-700 pt-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span>{dateStr}</span>
            {post.aiEnhanced && (
              <span className="flex items-center gap-1 text-purple-500 bg-purple-50 dark:bg-purple-900/20 px-1.5 py-0.5 rounded text-[10px] font-medium">
                <i className="fas fa-sparkles"></i> AI
              </span>
            )}
            {hasMultipleFiles && (
              <span className="flex items-center gap-1 text-brand-500 bg-brand-50 dark:bg-brand-900/20 px-1.5 py-0.5 rounded text-[10px] font-medium">
                <i className="fas fa-paperclip"></i> {mediaFiles.length} files
              </span>
            )}
          </div>

          <button
            onClick={() => onDelete(post.id)}
            className="text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
            title="Delete Post"
          >
            <i className="fas fa-trash"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostCard;