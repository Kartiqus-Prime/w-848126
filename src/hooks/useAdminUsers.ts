
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

// Import conditionnel pour éviter les erreurs côté client
let adminUserService: any = null;
let AdminUser: any = null;

try {
  const adminModule = require('@/lib/firebaseAdmin');
  adminUserService = adminModule.adminUserService;
  AdminUser = adminModule.AdminUser;
} catch (error) {
  console.warn('Firebase Admin service not available:', error);
}

export const useAdminUsers = () => {
  const { toast } = useToast();

  return useQuery({
    queryKey: ['admin-users'],
    queryFn: () => {
      if (!adminUserService) {
        throw new Error('Service admin non disponible');
      }
      return adminUserService.getAllUsers();
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 2,
    enabled: !!adminUserService,
    meta: {
      onError: () => {
        toast({
          title: "Erreur de connexion",
          description: "Impossible de récupérer les utilisateurs. Vérifiez la configuration Firebase Admin.",
          variant: "destructive"
        });
      }
    }
  });
};

export const useAdminUser = (uid: string) => {
  return useQuery({
    queryKey: ['admin-user', uid],
    queryFn: () => {
      if (!adminUserService) {
        throw new Error('Service admin non disponible');
      }
      return adminUserService.getUserById(uid);
    },
    enabled: !!uid && !!adminUserService,
    staleTime: 2 * 60 * 1000,
  });
};

export const useUpdateAdminUser = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ uid, properties }: { 
      uid: string; 
      properties: {
        email?: string;
        displayName?: string;
        disabled?: boolean;
        emailVerified?: boolean;
      }
    }) => {
      if (!adminUserService) {
        throw new Error('Service admin non disponible');
      }
      return adminUserService.updateUser(uid, properties);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
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

export const useDeleteAdminUser = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (uid: string) => {
      if (!adminUserService) {
        throw new Error('Service admin non disponible');
      }
      return adminUserService.deleteUser(uid);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
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

export const useSetUserClaims = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ uid, claims }: { uid: string; claims: { [key: string]: any } }) => {
      if (!adminUserService) {
        throw new Error('Service admin non disponible');
      }
      return adminUserService.setCustomClaims(uid, claims);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast({
        title: "Permissions mises à jour",
        description: "Les permissions de l'utilisateur ont été modifiées."
      });
    },
    onError: (error) => {
      console.error('Error setting user claims:', error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier les permissions.",
        variant: "destructive"
      });
    }
  });
};
