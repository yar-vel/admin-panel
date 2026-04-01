import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  changeEmailConfirm,
  changeEmailRequest,
  deleteSessions,
  updatePassword,
  updateProfile,
} from "@/entities/profile/api";
import { profileKeys } from "@/entities/profile/keys";

export const useUpdateProfileMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProfile,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: profileKeys.profile() }),
  });
};

export const useUpdatePasswordMutation = () =>
  useMutation({ mutationFn: updatePassword });

export const useChangeEmailRequestMutation = () =>
  useMutation({ mutationFn: changeEmailRequest });

export const useChangeEmailConfirmMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: changeEmailConfirm,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: profileKeys.profile() }),
  });
};

export const useDeleteSessionsMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteSessions,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: profileKeys.sessions() }),
  });
};
