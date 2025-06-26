
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface SupabaseUser {
  id: string;
  email?: string;
  display_name?: string;
  photo_url?: string;
  role: 'user' | 'admin';
  created_at: string;
  updated_at: string;
  preferences?: {
    dietaryRestrictions: string[];
    favoriteCategories: string[];
  };
}

export const useSupabaseUsers = () => {
  const { toast } = useToast();

  return useQuery({
    queryKey: ['supabase-users'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        return data.map(user => ({
          id: user.id,
          email: user.email || '',
          display_name: user.display_name || '',
          photo_url: user.photo_url,
          role: user.role as 'user' | 'admin',
          created_at: user.created_at,
          updated_at: user.updated_at,
          preferences: user.preferences
        })) as SupabaseUser[];
      } catch (error) {
        console.error('Error fetching users:', error);
        toast({
          title: "Erreur de connexion",
          description: "Impossible de récupérer les utilisateurs.",
          variant: "destructive"
        });
        throw error;
      }
    },
    staleTime: 2 * 60 * 1000,
    retry: 2
  });
};

export const useUpdateSupabaseUser = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ userId, data }: { 
      userId: string; 
      data: Partial<SupabaseUser>
    }) => {
      const { error } = await supabase
        .from('profiles')
        .update({
          display_name: data.display_name,
          role: data.role,
          preferences: data.preferences,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['supabase-users'] });
      toast({
        title: "Utilisateur modifié",
        description: "Les informations de l'utilisateur ont été mises à jour avec succès."
      });
    },
    onError: (error) => {
      console.error('Error updating user:', error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier l'utilisateur.",
        variant: "destructive"
      });
    }
  });
};

export const useDeleteSupabaseUser = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (userId: string) => {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['supabase-users'] });
      toast({
        title: "Utilisateur supprimé",
        description: "L'utilisateur a été supprimé avec succès.",
        variant: "destructive"
      });
    },
    onError: (error) => {
      console.error('Error deleting user:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'utilisateur.",
        variant: "destructive"
      });
    }
  });
};
