
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface SupabaseRecipe {
  id: string;
  title: string;
  description?: string;
  image?: string;
  cook_time: number;
  servings: number;
  difficulty?: string;
  rating?: number;
  category: string;
  ingredients: any;
  instructions: string[];
  video_id?: string;
  created_at: string;
  created_by: string;
}

export const useSupabaseRecipes = () => {
  const { toast } = useToast();

  return useQuery({
    queryKey: ['supabase-recipes'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('recipes')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        return data as SupabaseRecipe[];
      } catch (error) {
        console.error('Error fetching recipes:', error);
        toast({
          title: "Erreur de connexion",
          description: "Impossible de récupérer les recettes.",
          variant: "destructive"
        });
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000,
    retry: 3
  });
};

export const useCreateSupabaseRecipe = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (recipe: Omit<SupabaseRecipe, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('recipes')  
        .insert([recipe])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['supabase-recipes'] });
      toast({
        title: "Recette créée",
        description: "La recette a été créée avec succès."
      });
    },
    onError: (error) => {
      console.error('Error creating recipe:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer la recette.",
        variant: "destructive"
      });
    }
  });
};

export const useUpdateSupabaseRecipe = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<SupabaseRecipe> }) => {
      const { error } = await supabase
        .from('recipes')
        .update(data)
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['supabase-recipes'] });
      toast({
        title: "Recette modifiée",
        description: "La recette a été modifiée avec succès."
      });
    },
    onError: (error) => {
      console.error('Error updating recipe:', error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier la recette.",
        variant: "destructive"
      });
    }
  });
};

export const useDeleteSupabaseRecipe = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('recipes')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['supabase-recipes'] });
      toast({
        title: "Recette supprimée",
        description: "La recette a été supprimée avec succès.",
        variant: "destructive"
      });
    },
    onError: (error) => {
      console.error('Error deleting recipe:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la recette.",
        variant: "destructive"
      });
    }
  });
};
