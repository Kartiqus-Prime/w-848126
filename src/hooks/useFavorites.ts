
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { favoriteService } from '@/lib/firestore-favorites';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/hooks/use-toast';

export const useFavorites = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const favoritesQuery = useQuery({
    queryKey: ['favorites', currentUser?.id],
    queryFn: () => favoriteService.getUserFavorites(currentUser!.id),
    enabled: !!currentUser,
  });

  const addFavoriteMutation = useMutation({
    mutationFn: ({ itemId, type }: { itemId: string; type: string }) =>
      favoriteService.addFavorite(currentUser!.id, itemId, type),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites', currentUser?.id] });
      toast({
        title: "Ajouté aux favoris",
        description: "L'élément a été ajouté à vos favoris",
      });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter aux favoris",
        variant: "destructive",
      });
    },
  });

  const removeFavoriteMutation = useMutation({
    mutationFn: ({ itemId, type }: { itemId: string; type: string }) =>
      favoriteService.removeFavorite(currentUser!.id, itemId, type),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites', currentUser?.id] });
      toast({
        title: "Retiré des favoris",
        description: "L'élément a été retiré de vos favoris",
      });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Impossible de retirer des favoris",
        variant: "destructive",
      });
    },
  });

  return {
    ...favoritesQuery,
    addFavorite: addFavoriteMutation.mutate,
    removeFavorite: removeFavoriteMutation.mutate,
    isAddingFavorite: addFavoriteMutation.isPending,
    isRemovingFavorite: removeFavoriteMutation.isPending,
  };
};
