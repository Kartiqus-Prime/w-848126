
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface SupabaseVideo {
  id: string;
  title: string;
  description?: string;
  cloudinary_public_id: string;
  thumbnail?: string;
  duration?: string;
  views?: number;
  likes?: number;
  category: string;
  recipe_id?: string;
  created_at: string;
  created_by: string;
}

export const useSupabaseVideos = (filters?: any) => {
  const { toast } = useToast();

  return useQuery({
    queryKey: ['supabase-videos', filters],
    queryFn: async () => {
      try {
        let query = supabase
          .from('videos')
          .select('*')
          .order('created_at', { ascending: false });

        if (filters?.category) {
          query = query.eq('category', filters.category);
        }

        if (filters?.search) {
          query = query.ilike('title', `%${filters.search}%`);
        }

        const { data, error } = await query;

        if (error) throw error;
        return data as SupabaseVideo[];
      } catch (error) {
        console.error('Error fetching videos:', error);
        toast({
          title: "Erreur de connexion",
          description: "Impossible de récupérer les vidéos.",
          variant: "destructive"
        });
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000,
    retry: 3
  });
};

export const useCreateSupabaseVideo = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (video: Omit<SupabaseVideo, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('videos')
        .insert([video])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['supabase-videos'] });
      toast({
        title: "Vidéo créée",
        description: "La vidéo a été créée avec succès."
      });
    },
    onError: (error) => {
      console.error('Error creating video:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer la vidéo.",
        variant: "destructive"
      });
    }
  });
};

export const useUpdateSupabaseVideo = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<SupabaseVideo> }) => {
      const { error } = await supabase
        .from('videos')
        .update(data)
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['supabase-videos'] });
      toast({
        title: "Vidéo modifiée",
        description: "La vidéo a été modifiée avec succès."
      });
    },
    onError: (error) => {
      console.error('Error updating video:', error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier la vidéo.",
        variant: "destructive"
      });
    }
  });
};

export const useDeleteSupabaseVideo = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('videos')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['supabase-videos'] });
      toast({
        title: "Vidéo supprimée",
        description: "La vidéo a été supprimée avec succès.",
        variant: "destructive"
      });
    },
    onError: (error) => {
      console.error('Error deleting video:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la vidéo.",
        variant: "destructive"
      });
    }
  });
};
