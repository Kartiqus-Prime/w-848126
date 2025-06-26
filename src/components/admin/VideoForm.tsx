
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, Video as VideoIcon } from 'lucide-react';
import { Video } from '@/lib/firestore';
import { useAuth } from '@/contexts/AuthContext';
import { useRecipes } from '@/hooks/useRecipes';
import { uploadVideoToCloudinary } from '@/lib/cloudinary';
import { useToast } from '@/hooks/use-toast';

interface VideoFormProps {
  video?: Video;
  onSubmit: (data: Omit<Video, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const VideoForm: React.FC<VideoFormProps> = ({ video, onSubmit, onCancel, isLoading }) => {
  const { currentUser } = useAuth();
  const { data: recipes } = useRecipes();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    title: video?.title || '',
    description: video?.description || '',
    cloudinaryPublicId: video?.cloudinaryPublicId || '',
    duration: video?.duration || '',
    views: video?.views || 0,
    likes: video?.likes || 0,
    category: video?.category || '',
    recipeId: video?.recipeId || '',
    createdBy: video?.createdBy || currentUser?.uid || ''
  });
  
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [videoPreview, setVideoPreview] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
      // Créer une URL de prévisualisation
      const url = URL.createObjectURL(file);
      setVideoPreview(url);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let cloudinaryPublicId = formData.cloudinaryPublicId;
    
    // Si un nouveau fichier est sélectionné, l'uploader
    if (videoFile) {
      setUploading(true);
      try {
        const uploadedUrl = await uploadVideoToCloudinary(videoFile);
        // Extraire le publicId de l'URL Cloudinary
        const urlParts = uploadedUrl.split('/');
        const publicIdWithExtension = urlParts[urlParts.length - 1];
        cloudinaryPublicId = publicIdWithExtension.split('.')[0];
        
        toast({
          title: "Vidéo uploadée",
          description: "La vidéo a été uploadée avec succès sur Cloudinary"
        });
      } catch (error) {
        toast({
          title: "Erreur d'upload",
          description: "Impossible d'uploader la vidéo",
          variant: "destructive"
        });
        setUploading(false);
        return;
      }
      setUploading(false);
    }

    const cleanData = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      cloudinaryPublicId,
      duration: formData.duration.trim(),
      views: Math.max(0, formData.views || 0),
      likes: Math.max(0, formData.likes || 0),
      category: formData.category.trim(),
      recipeId: formData.recipeId || undefined,
      createdBy: formData.createdBy || currentUser?.uid || ''
    };

    console.log('Submitting video data:', cleanData);
    onSubmit(cleanData);
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <VideoIcon className="h-5 w-5 mr-2" />
          {video ? 'Modifier la vidéo' : 'Ajouter une vidéo'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Titre *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="category">Catégorie *</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                placeholder="ex: Techniques de base"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows={3}
              required
            />
          </div>

          <div>
            <Label htmlFor="recipeId">Recette associée (optionnel)</Label>
            <Select value={formData.recipeId} onValueChange={(value) => setFormData({...formData, recipeId: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une recette" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Aucune recette</SelectItem>
                {recipes?.map((recipe) => (
                  <SelectItem key={recipe.id} value={recipe.id}>
                    {recipe.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="video">Fichier vidéo *</Label>
            <div className="mt-2">
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-4 text-gray-500" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Cliquer pour uploader</span> ou glisser-déposer
                    </p>
                    <p className="text-xs text-gray-500">MP4, AVI, MOV (MAX. 100MB)</p>
                  </div>
                  <input
                    id="video"
                    type="file"
                    className="hidden"
                    accept="video/*"
                    onChange={handleFileChange}
                  />
                </label>
              </div>
              {videoFile && (
                <p className="mt-2 text-sm text-green-600">
                  Fichier sélectionné: {videoFile.name}
                </p>
              )}
            </div>
          </div>

          {videoPreview && (
            <div>
              <Label>Prévisualisation</Label>
              <video
                src={videoPreview}
                controls
                className="w-full max-w-md h-48 rounded-lg border"
              />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="duration">Durée *</Label>
              <Input
                id="duration"
                value={formData.duration}
                onChange={(e) => setFormData({...formData, duration: e.target.value})}
                placeholder="ex: 10:30"
                required
              />
            </div>
            <div>
              <Label htmlFor="views">Vues</Label>
              <Input
                id="views"
                type="number"
                value={formData.views}
                onChange={(e) => setFormData({...formData, views: parseInt(e.target.value)})}
              />
            </div>
            <div>
              <Label htmlFor="likes">Likes</Label>
              <Input
                id="likes"
                type="number"
                value={formData.likes}
                onChange={(e) => setFormData({...formData, likes: parseInt(e.target.value)})}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Annuler
            </Button>
            <Button type="submit" disabled={isLoading || uploading}>
              {uploading ? 'Upload en cours...' : isLoading ? 'Enregistrement...' : (video ? 'Modifier' : 'Créer')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default VideoForm;
