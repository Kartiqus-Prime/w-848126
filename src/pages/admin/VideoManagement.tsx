import React, { useState, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Video as VideoType } from '@/lib/firestore';
import { VideoFilters as VideoFiltersType } from '@/lib/videoService';
import { useEnhancedVideos, useCreateVideo, useUpdateVideo, useDeleteVideo } from '@/hooks/useEnhancedVideos';
import { useAdminUsers } from '@/hooks/useAdminUsers';
import VideoHeader from '@/components/admin/video/VideoHeader';
import VideoFilters from '@/components/admin/video/VideoFilters';
import VideoTable from '@/components/admin/video/VideoTable';
import VideoForm from '@/components/admin/VideoForm';

const VideoManagement = () => {
  const [filters, setFilters] = useState<VideoFiltersType>({});
  const [showForm, setShowForm] = useState(false);
  const [editingVideo, setEditingVideo] = useState<VideoType | null>(null);
  
  const { toast } = useToast();
  const { currentUser } = useAuth();
  
  // Hooks pour les données
  const { data: videos = [], isLoading: videosLoading, refetch } = useEnhancedVideos(filters);
  const { data: users = [], isLoading: usersLoading } = useAdminUsers();
  
  // Mutations
  const createVideoMutation = useCreateVideo();
  const updateVideoMutation = useUpdateVideo();
  const deleteVideoMutation = useDeleteVideo();

  // Données calculées
  const categories = useMemo(() => {
    const allCategories = new Set(videos.map(video => video.category));
    return Array.from(allCategories).sort();
  }, [videos]);

  const videoCreators = useMemo(() => {
    const creatorIds = new Set(videos.map(video => video.createdBy));
    return users.filter(user => creatorIds.has(user.uid));
  }, [videos, users]);

  // Handlers
  const handleCreate = async (data: Omit<VideoType, 'id' | 'createdAt'>) => {
    if (!currentUser) return;
    
    try {
      await createVideoMutation.mutateAsync({
        ...data,
        createdBy: currentUser.uid
      });
      setShowForm(false);
      refetch();
    } catch (error) {
      console.error('Error creating video:', error);
    }
  };

  const handleUpdate = async (data: Omit<VideoType, 'id' | 'createdAt'>) => {
    if (!editingVideo) return;
    
    try {
      await updateVideoMutation.mutateAsync({
        id: editingVideo.id,
        data
      });
      setEditingVideo(null);
      refetch();
    } catch (error) {
      console.error('Error updating video:', error);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer la vidéo "${title}" ?`)) {
      try {
        await deleteVideoMutation.mutateAsync(id);
        refetch();
      } catch (error) {
        console.error('Error deleting video:', error);
      }
    }
  };

  const handleAddVideo = () => {
    setShowForm(true);
  };

  const handleEdit = (video: VideoType) => {
    setEditingVideo(video);
  };

  const isLoading = videosLoading || usersLoading;
  const isMutating = createVideoMutation.isPending || updateVideoMutation.isPending || deleteVideoMutation.isPending;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <VideoHeader 
        onAddVideo={handleAddVideo}
        videoCount={videos.length}
      />

      {/* Filtres et recherche */}
      <VideoFilters
        filters={filters}
        onFiltersChange={setFilters}
        categories={categories}
        users={videoCreators}
      />

      {/* Tableau des vidéos */}
      <VideoTable
        videos={videos}
        users={users}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isLoading={isMutating}
      />

      {/* Dialog pour créer une vidéo */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Ajouter une vidéo</DialogTitle>
          </DialogHeader>
          <VideoForm
            onSubmit={handleCreate}
            onCancel={() => setShowForm(false)}
            isLoading={createVideoMutation.isPending}
          />
        </DialogContent>
      </Dialog>

      {/* Dialog pour modifier une vidéo */}
      <Dialog open={!!editingVideo} onOpenChange={() => setEditingVideo(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Modifier la vidéo</DialogTitle>
          </DialogHeader>
          {editingVideo && (
            <VideoForm
              video={editingVideo}
              onSubmit={handleUpdate}
              onCancel={() => setEditingVideo(null)}
              isLoading={updateVideoMutation.isPending}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VideoManagement;
