import React, { useState, useRef } from 'react';
import { MediaType } from '../types';
import { api } from '../services/dataService';
import { enhanceText } from '../services/gemini';
import { formatFileSize, validateFileSize } from '../services/compression';

interface CreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated: () => void;
}

const CreateModal: React.FC<CreateModalProps> = ({ isOpen, onClose, onPostCreated }) => {
  const [content, setContent] = useState('');
  const [mediaType, setMediaType] = useState<MediaType>(MediaType.TEXT);
  const [files, setFiles] = useState<File[]>([]);
  const [filePreviews, setFilePreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const MAX_FILES = 7;

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);

      // Validate file sizes
      const invalidFiles = selectedFiles.filter(f => !validateFileSize(f, 100));
      if (invalidFiles.length > 0) {
        alert(`Some files are too large (max 100MB per file): ${invalidFiles.map(f => f.name).join(', ')}`);
        return;
      }

      // Limit to MAX_FILES total
      const remainingSlots = MAX_FILES - files.length;
      const filesToAdd = selectedFiles.slice(0, remainingSlots);

      if (selectedFiles.length > remainingSlots) {
        alert(`You can only upload up to ${MAX_FILES} files. Only the first ${remainingSlots} files will be added.`);
      }

      const newFiles = [...files, ...filesToAdd];
      setFiles(newFiles);

      // Create previews
      const newPreviews: string[] = [];
      filesToAdd.forEach(file => {
        const objectUrl = URL.createObjectURL(file);
        newPreviews.push(objectUrl);
      });
      setFilePreviews([...filePreviews, ...newPreviews]);

      // Detect primary type from first file
      if (files.length === 0 && filesToAdd.length > 0) {
        const mime = filesToAdd[0].type;
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
    }
  };

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    const newPreviews = filePreviews.filter((_, i) => i !== index);

    // Revoke object URL to free memory
    URL.revokeObjectURL(filePreviews[index]);

    setFiles(newFiles);
    setFilePreviews(newPreviews);

    if (newFiles.length === 0) {
      setMediaType(MediaType.TEXT);
    }
  };

  const clearAllFiles = () => {
    filePreviews.forEach(url => URL.revokeObjectURL(url));
    setFiles([]);
    setFilePreviews([]);
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
    if (!content && files.length === 0) return;

    setIsSubmitting(true);
    const result = await api.createPost(content, files.length > 0 ? files : null, mediaType);
    setIsSubmitting(false);

    if (result.success) {
      setContent('');
      clearAllFiles();
      onPostCreated();
      onClose();
    } else {
      alert("Failed to create post: " + result.error);
    }
  };

  // Helper to get file type icon
  const getFileIcon = (file: File) => {
    const mime = file.type;
    if (mime.startsWith('image/')) return 'fa-image';
    if (mime.startsWith('video/')) return 'fa-video';
    if (mime.startsWith('audio/')) return 'fa-music';
    if (mime.includes('pdf')) return 'fa-file-pdf';
    if (mime.includes('word')) return 'fa-file-word';
    if (mime.includes('excel') || mime.includes('spreadsheet')) return 'fa-file-excel';
    if (mime.includes('zip') || mime.includes('rar')) return 'fa-file-zipper';
    return 'fa-file';
  };

  // Helper to render preview based on type
  const renderPreview = (file: File, preview: string, index: number) => {
    const mime = file.type;

    return (
      <div key={index} className="relative rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 group bg-gray-50 dark:bg-gray-900">
        {mime.startsWith('image/') ? (
          <img src={preview} alt={file.name} className="w-full h-32 object-cover" />
        ) : mime.startsWith('video/') ? (
          <video src={preview} className="w-full h-32 bg-black object-contain" />
        ) : mime.startsWith('audio/') ? (
          <div className="w-full h-32 flex flex-col items-center justify-center p-2">
            <i className="fas fa-music text-3xl text-gray-400 mb-2"></i>
            <p className="text-xs text-center truncate w-full px-2">{file.name}</p>
          </div>
        ) : (
          <div className="w-full h-32 flex flex-col items-center justify-center p-2">
            <i className={`fas ${getFileIcon(file)} text-3xl text-gray-400 mb-2`}></i>
            <p className="text-xs text-center truncate w-full px-2">{file.name}</p>
          </div>
        )}

        {/* File info overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
          <p className="text-white text-xs truncate">{file.name}</p>
          <p className="text-white/70 text-xs">{formatFileSize(file.size)}</p>
        </div>

        {/* Remove button */}
        <button
          onClick={() => removeFile(index)}
          className="absolute top-2 right-2 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
        >
          <i className="fas fa-times text-xs"></i>
        </button>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-dark-800 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-slide-up flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
          <div>
            <h3 className="font-bold text-lg">Create Post</h3>
            {files.length > 0 && (
              <p className="text-xs text-gray-500 mt-1">
                {files.length} / {MAX_FILES} files selected
              </p>
            )}
          </div>
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

          {/* Media Preview Grid */}
          {files.length > 0 && (
            <div className="mt-4">
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Attached Files ({files.length})
                </p>
                <button
                  onClick={clearAllFiles}
                  className="text-xs text-red-500 hover:text-red-600 flex items-center gap-1"
                >
                  <i className="fas fa-trash"></i>
                  Clear All
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {files.map((file, index) => renderPreview(file, filePreviews[index], index))}
              </div>
            </div>
          )}

          {/* Tools */}
          <div className="mt-6">
            <div
              onClick={() => fileInputRef.current?.click()}
              className={`cursor-pointer h-20 border-2 border-dashed rounded-xl flex flex-col items-center justify-center transition-all ${files.length >= MAX_FILES
                  ? 'border-gray-200 dark:border-gray-800 text-gray-300 cursor-not-allowed'
                  : 'border-gray-300 dark:border-gray-700 text-gray-400 hover:text-brand-500 hover:border-brand-500 hover:bg-brand-50 dark:hover:bg-brand-900/20'
                }`}
            >
              <i className="fas fa-paperclip text-2xl mb-1"></i>
              <span className="text-xs font-medium">
                {files.length >= MAX_FILES ? `Maximum ${MAX_FILES} files reached` : `Attach Files (up to ${MAX_FILES})`}
              </span>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              multiple
              disabled={files.length >= MAX_FILES}
            />
          </div>

        </div>

        {/* Footer */}
        <div className="p-6 pt-2 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
          <p className="text-xs text-gray-500">
            {files.length > 0 && `Total: ${formatFileSize(files.reduce((sum, f) => sum + f.size, 0))}`}
          </p>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || (!content && files.length === 0)}
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