import React from 'react';
import { Post, MediaType } from '../types';

interface PostCardProps {
  post: Post;
  onDelete: (id: string) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onDelete }) => {
  const dateStr = new Date(post.createdAt).toLocaleDateString(undefined, {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  const isFileAttachment = post.mediaType === MediaType.DOCUMENT || post.mediaType === MediaType.OTHER;

  return (
    <div className="break-inside-avoid mb-6 bg-white dark:bg-dark-800 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border border-gray-100 dark:border-gray-700 group">
      
      {/* Media Content */}
      {post.mediaUrl && (
        <div className="w-full">
          {post.mediaType === MediaType.IMAGE && (
            <div className="relative w-full aspect-auto max-h-96 overflow-hidden">
              <img 
                src={post.mediaUrl} 
                alt="Post content" 
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          )}

          {post.mediaType === MediaType.VIDEO && (
            <div className="relative w-full aspect-video bg-black">
              <video src={post.mediaUrl} controls className="w-full h-full" />
            </div>
          )}

          {post.mediaType === MediaType.AUDIO && (
            <div className="w-full p-4 bg-gray-50 dark:bg-gray-900 border-b border-gray-100 dark:border-gray-700">
               <audio src={post.mediaUrl} controls className="w-full" />
            </div>
          )}

          {isFileAttachment && (
            <div className="p-4 bg-gray-50 dark:bg-gray-900 border-b border-gray-100 dark:border-gray-700">
              <a 
                href={post.mediaUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center gap-3 p-3 bg-white dark:bg-dark-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors shadow-sm"
              >
                <div className={`${post.mediaType === MediaType.DOCUMENT ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-500' : 'bg-gray-100 dark:bg-gray-700 text-gray-500'} p-2.5 rounded-lg`}>
                   <i className={`fas ${post.mediaType === MediaType.DOCUMENT ? 'fa-file-lines' : 'fa-box-open'} text-lg`}></i>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                    {post.fileName || (post.mediaType === MediaType.DOCUMENT ? 'Document' : 'File')}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-gray-500">Tap to download</span>
                    <i className="fas fa-download text-[10px] text-gray-400"></i>
                  </div>
                </div>
              </a>
            </div>
          )}
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
          <div className="flex items-center gap-2">
            <span>{dateStr}</span>
            {post.aiEnhanced && (
              <span className="flex items-center gap-1 text-purple-500 bg-purple-50 dark:bg-purple-900/20 px-1.5 py-0.5 rounded text-[10px] font-medium">
                <i className="fas fa-sparkles"></i> AI
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