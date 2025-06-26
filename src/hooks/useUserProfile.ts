
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService, UserProfile } from '@/lib/firestore';
import { useAuth } from '@/contexts/AuthContext';

export const useUserProfile = () => {
  const { currentUser } = useAuth();
  
  return useQuery({
    queryKey: ['userProfile', currentUser?.uid],
    queryFn: () => userService.getProfile(currentUser!.uid),
    enabled: !!currentUser,
  });
};

export const useUpdateProfile = () => {
  const { currentUser } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<UserProfile>) => 
      userService.updateProfile(currentUser!.uid, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile', currentUser?.uid] });
    },
  });
};
