
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, Trash2, Video, Eye, Heart, Play, Clock } from 'lucide-react';
import { Video as VideoType } from '@/lib/firestore';
import { getVideoThumbnail } from '@/lib/cloudinary';
import { AdminUser } from '@/lib/firebaseAdmin';

interface VideoTableProps {
  videos: VideoType[];
  users: AdminUser[];
  onEdit: (video: VideoType) => void;
  onDelete: (id: string, title: string) => void;
  isLoading?: boolean;
}

const VideoTable: React.FC<VideoTableProps> = ({
  videos,
  users,
  onEdit,
  onDelete,
  isLoading
}) => {
  const getUserDisplayName = (userId: string) => {
    const user = users.find(u => u.uid === userId);
    return user?.displayName || user?.email || 'Utilisateur inconnu';
  };

  const formatDuration = (duration: string) => {
    return duration;
  };

  const formatDate = (date: any) => {
    if (!date) return 'Date inconnue';
    const dateObj = date.toDate ? date.toDate() : new Date(date);
    return dateObj.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Video className="h-5 w-5 mr-2" />
          Vidéos ({videos.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {videos.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Play className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-600 mb-2">Aucune vidéo trouvée</h3>
            <p className="text-gray-500">Commencez par ajouter votre première vidéo.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vidéo</TableHead>
                  <TableHead>Créateur</TableHead>
                  <TableHead>Catégorie</TableHead>
                  <TableHead>Durée</TableHead>
                  <TableHead>Statistiques</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {videos.map((video) => (
                  <TableRow key={video.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <img 
                            src={video.cloudinaryPublicId ? getVideoThumbnail(video.cloudinaryPublicId) : '/placeholder.svg'} 
                            alt={video.title}
                            className="w-20 h-14 rounded-lg object-cover"
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
                            <Play className="h-4 w-4 text-white" />
                          </div>
                          <div className="absolute bottom-1 right-1 bg-black bg-opacity-75 text-white text-xs px-1 rounded flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {formatDuration(video.duration)}
                          </div>
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm line-clamp-2">{video.title}</p>
                          <p className="text-xs text-gray-500 line-clamp-1 mt-1">
                            {video.description}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p className="font-medium">{getUserDisplayName(video.createdBy)}</p>
                        <p className="text-gray-500 text-xs">{video.createdBy}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {video.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm font-mono">{video.duration}</span>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-1 text-xs">
                          <Eye className="h-3 w-3 text-gray-400" />
                          <span>{video.views.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-xs">
                          <Heart className="h-3 w-3 text-red-400" />
                          <span>{video.likes.toLocaleString()}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-500">
                        {formatDate(video.createdAt)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => onEdit(video)}
                          className="h-8 w-8"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => onDelete(video.id, video.title)}
                          className="h-8 w-8 hover:text-red-500"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VideoTable;
