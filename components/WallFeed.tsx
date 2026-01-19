import React, { useEffect, useState } from 'react';
import { api } from '../services/dataService';
import { Post } from '../types';
import PostCard from './PostCard';
import CreateModal from './CreateModal';

const WallFeed: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchPosts = async () => {
    // We don't set loading to true here to allow background refreshes
    const result = await api.getPosts();
    if (result.success && result.data) {
      setPosts(result.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDelete = async (id: string) => {
      if(window.confirm("Are you sure you want to delete this memory?")) {
          await api.deletePost(id);
          fetchPosts();
      }
  }

  return (
    <div className="relative min-h-[80vh]">
      
      {/* Header / Actions */}
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Timeline</h1>
          <p className="text-gray-500 text-sm">Your digital memory bank.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-brand-600 hover:bg-brand-500 text-white px-5 py-2.5 rounded-full font-semibold shadow-lg shadow-brand-500/30 hover:shadow-brand-500/50 transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
        >
          <i className="fas fa-plus"></i>
          <span>Create</span>
        </button>
      </div>

      {/* Grid */}
      {loading && posts.length === 0 ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500"></div>
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <i className="fas fa-layer-group text-4xl mb-4 opacity-50"></i>
          <p>Your wall is empty. Start creating!</p>
        </div>
      ) : (
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {posts.map(post => (
            <PostCard key={post.id} post={post} onDelete={handleDelete} />
          ))}
        </div>
      )}

      {/* Create Modal */}
      <CreateModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onPostCreated={fetchPosts} 
      />
    </div>
  );
};

export default WallFeed;