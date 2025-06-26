
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService, UserProfile } from '@/lib/firestore';
import { useAuth } from '@/contexts/SupabaseAuthContext';

export const useUserProfile = () => {
  const { currentUser } = useAuth();
  
  return useQuery({
    queryKey: ['userProfile', currentUser?.id],
    queryFn: () => userService.getProfile(currentUser!.id),
    enabled: !!currentUser,
  });
};

export const useUpdateProfile = () => {
  const { currentUser } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<UserProfile>) => 
      userService.updateProfile(currentUser!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile', currentUser?.id] });
    },
  });
};
