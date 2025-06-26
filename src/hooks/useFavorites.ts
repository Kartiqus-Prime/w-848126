
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { favoriteService } from '@/lib/firestore-favorites';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export const useFavorites = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const favoritesQuery = useQuery({
    queryKey: ['favorites', currentUser?.uid],
    queryFn: () => favoriteService.getUserFavorites(currentUser!.uid),
    enabled: !!currentUser,
  });

  const addFavoriteMutation = useMutation({
    mutationFn: ({ itemId, type }: { itemId: string; type: string }) =>
      favoriteService.addFavorite(currentUser!.uid, itemId, type),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites', currentUser?.uid] });
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
      favoriteService.removeFavorite(currentUser!.uid, itemId, type),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites', currentUser?.uid] });
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
