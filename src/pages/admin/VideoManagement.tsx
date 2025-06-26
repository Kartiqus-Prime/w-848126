
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Search, Plus, Edit, Trash2, Video, Eye, Heart } from 'lucide-react';
import { useVideos } from '@/hooks/useVideos';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { videoService, Video as VideoType } from '@/lib/firestore';
import VideoForm from '@/components/admin/VideoForm';

const VideoManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingVideo, setEditingVideo] = useState<VideoType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { data: videos, isLoading: videosLoading, refetch } = useVideos();
  const { toast } = useToast();
  const { currentUser } = useAuth();

  const filteredVideos = videos?.filter(video => 
    video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    video.category.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleCreate = async (data: Omit<VideoType, 'id' | 'createdAt'>) => {
    if (!currentUser) return;
    
    setIsLoading(true);
    try {
      const videoData = {
        ...data,
        createdBy: currentUser.uid
      };
      await videoService.create(videoData);
      toast({
        title: "Vidéo créée",
        description: "La vidéo a été créée avec succès"
      });
      setShowForm(false);
      refetch();
    } catch (error) {
      console.error('Error creating video:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer la vidéo",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (data: Omit<VideoType, 'id' | 'createdAt'>) => {
    if (!editingVideo) return;
    
    setIsLoading(true);
    try {
      await videoService.update(editingVideo.id, data);
      toast({
        title: "Vidéo modifiée",
        description: "La vidéo a été modifiée avec succès"
      });
      setEditingVideo(null);
      refetch();
    } catch (error) {
      console.error('Error updating video:', error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier la vidéo",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer la vidéo "${title}" ?`)) {
      try {
        await videoService.delete(id);
        toast({
          title: "Vidéo supprimée",
          description: `La vidéo "${title}" a été supprimée avec succès`
        });
        refetch();
      } catch (error) {
        console.error('Error deleting video:', error);
        toast({
          title: "Erreur",
          description: "Impossible de supprimer la vidéo",
          variant: "destructive"
        });
      }
    }
  };

  const handleAddVideo = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowForm(true);
  };

  if (videosLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Gestion des vidéos</h1>
        <Button 
          type="button"
          className="bg-orange-500 hover:bg-orange-600"
          onClick={handleAddVideo}
        >
          <Plus className="h-4 w-4 mr-2" />
          Ajouter une vidéo
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Rechercher une vidéo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Videos Table */}
      <Card>
        <CardHeader>
          <CardTitle>Vidéos ({filteredVideos.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vidéo</TableHead>
                <TableHead>Catégorie</TableHead>
                <TableHead>Durée</TableHead>
                <TableHead>Vues</TableHead>
                <TableHead>Likes</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVideos.map((video) => (
                <TableRow key={video.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <img 
                          src={video.thumbnail} 
                          alt={video.title}
                          className="w-16 h-12 rounded-lg object-cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
                          <Video className="h-4 w-4 text-white" />
                        </div>
                      </div>
                      <div>
                        <p className="font-medium">{video.title}</p>
                        <p className="text-sm text-gray-500">{video.description.slice(0, 50)}...</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{video.category}</Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{video.duration}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Eye className="h-4 w-4 text-gray-400" />
                      <span>{video.views.toLocaleString()}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Heart className="h-4 w-4 text-red-400" />
                      <span>{video.likes.toLocaleString()}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => setEditingVideo(video)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleDelete(video.id, video.title)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Ajouter une vidéo</DialogTitle>
          </DialogHeader>
          <VideoForm
            onSubmit={handleCreate}
            onCancel={() => setShowForm(false)}
            isLoading={isLoading}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Form Dialog */}
      <Dialog open={!!editingVideo} onOpenChange={() => setEditingVideo(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Modifier la vidéo</DialogTitle>
          </DialogHeader>
          {editingVideo && (
            <VideoForm
              video={editingVideo}
              onSubmit={handleUpdate}
              onCancel={() => setEditingVideo(null)}
              isLoading={isLoading}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VideoManagement;
