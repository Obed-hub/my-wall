import React, { useState, useRef } from 'react';
import { MediaType } from '../types';
import { api } from '../services/dataService';
import { enhanceText } from '../services/gemini';

interface CreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated: () => void;
}

const CreateModal: React.FC<CreateModalProps> = ({ isOpen, onClose, onPostCreated }) => {
  const [content, setContent] = useState('');
  const [mediaType, setMediaType] = useState<MediaType>(MediaType.TEXT);
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      
      // Create preview
      const objectUrl = URL.createObjectURL(selectedFile);
      setFilePreview(objectUrl);
      
      // Detect type
      const mime = selectedFile.type;
      if (mime.startsWith('image/')) {
        setMediaType(MediaType.IMAGE);
      } else if (mime.startsWith('video/')) {
        setMediaType(MediaType.VIDEO);
      } else if (mime.startsWith('audio/')) {
        setMediaType(MediaType.AUDIO);
      } else if (
        mime.includes('pdf') || 
        mime.includes('msword') || 
        mime.includes('officedocument') || 
        mime.includes('text/') ||
        mime.includes('zip') ||
        mime.includes('csv')
      ) {
        setMediaType(MediaType.DOCUMENT);
      } else {
        setMediaType(MediaType.OTHER);
      }
    }
  };

  const clearFile = () => {
    setFile(null);
    setFilePreview(null);
    setMediaType(MediaType.TEXT);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleEnhance = async () => {
    if (!content.trim()) return;
    setIsEnhancing(true);
    const improved = await enhanceText(content);
    setContent(improved);
    setIsEnhancing(false);
  };

  const handleSubmit = async () => {
    if (!content && !file) return;

    setIsSubmitting(true);
    const result = await api.createPost(content, file, mediaType);
    setIsSubmitting(false);

    if (result.success) {
      setContent('');
      clearFile();
      onPostCreated();
      onClose();
    } else {
      alert("Failed to create post: " + result.error);
    }
  };

  // Helper to render preview based on type
  const renderPreview = () => {
    if (!filePreview) return null;

    if (mediaType === MediaType.IMAGE) {
      return <img src={filePreview} alt="Preview" className="w-full h-48 object-cover" />;
    }
    if (mediaType === MediaType.VIDEO) {
      return <video src={filePreview} className="w-full h-48 bg-black object-contain" controls />;
    }
    if (mediaType === MediaType.AUDIO) {
      return (
        <div className="w-full h-24 bg-gray-100 dark:bg-gray-800 flex items-center justify-center p-4">
           <audio src={filePreview} controls className="w-full" />
        </div>
      );
    }
    // Document or Other
    return (
      <div className="w-full h-24 bg-gray-100 dark:bg-gray-800 flex items-center gap-4 p-4">
        <div className="bg-white dark:bg-dark-900 p-3 rounded-lg shadow-sm">
           <i className={`fas ${mediaType === MediaType.DOCUMENT ? 'fa-file-alt' : 'fa-box-open'} text-2xl text-gray-500`}></i>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm truncate">{file?.name}</p>
          <p className="text-xs text-gray-500 uppercase">{mediaType}: {file?.name.split('.').pop() || 'FILE'}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-dark-800 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-slide-up flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
          <h3 className="font-bold text-lg">Create Post</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto no-scrollbar">
          
          {/* Text Area */}
          <div className="relative">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's on your mind?"
              className="w-full h-32 p-4 bg-gray-50 dark:bg-dark-900 rounded-xl resize-none outline-none focus:ring-2 focus:ring-brand-500 border border-transparent focus:border-transparent transition-all"
            />
            {/* AI Button */}
            <button 
              onClick={handleEnhance}
              disabled={isEnhancing || !content}
              className="absolute bottom-3 right-3 text-xs bg-white dark:bg-dark-800 text-purple-600 border border-purple-200 dark:border-purple-900/50 shadow-sm hover:shadow px-2 py-1 rounded-md transition-all flex items-center gap-1 disabled:opacity-50"
              title="Enhance with AI"
            >
              {isEnhancing ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-wand-magic-sparkles"></i>}
              {isEnhancing ? 'Fixing...' : 'AI Polish'}
            </button>
          </div>

          {/* Media Preview */}
          {filePreview && (
            <div className="mt-4 relative rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 group">
              {renderPreview()}
              <button 
                onClick={clearFile}
                className="absolute top-2 right-2 bg-black/70 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-500 transition-colors z-10"
              >
                <i className="fas fa-trash text-xs"></i>
              </button>
            </div>
          )}

          {/* Tools */}
          <div className="mt-6 flex gap-4">
             <div 
               onClick={() => fileInputRef.current?.click()}
               className="cursor-pointer flex-1 h-24 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl flex flex-col items-center justify-center text-gray-400 hover:text-brand-500 hover:border-brand-500 hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-all"
             >
               <i className="fas fa-paperclip text-2xl mb-1"></i>
               <span className="text-xs font-medium">Attach Any File</span>
             </div>
             <input 
               type="file" 
               ref={fileInputRef} 
               onChange={handleFileChange}
               className="hidden"
             />
          </div>

        </div>

        {/* Footer */}
        <div className="p-6 pt-2 border-t border-gray-100 dark:border-gray-700 flex justify-end">
          <button 
            onClick={handleSubmit}
            disabled={isSubmitting || (!content && !file)}
            className="bg-brand-600 hover:bg-brand-500 text-white px-6 py-2.5 rounded-xl font-medium shadow-lg shadow-brand-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Posting...' : 'Post to Wall'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default CreateModal;