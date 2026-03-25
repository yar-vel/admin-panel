import { useQueryClient, useMutation } from "@tanstack/react-query";

import {
  createUser,
  updateUser,
  updateUserRoles,
  deleteUsers,
} from "@/entities/user/api";
import { userKeys } from "@/entities/user/keys";

export const useCreateUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createUser,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: userKeys.lists() }),
  });
};

export const useUpdateUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUser,
    onSuccess: (_, { id }) =>
      queryClient.invalidateQueries({ queryKey: userKeys.detail(id) }),
  });
};

export const useUpdateUserRolesMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUserRoles,
    onSuccess: (_, { id }) =>
      queryClient.invalidateQueries({ queryKey: userKeys.detail(id) }),
  });
};

export const useDeleteUsersMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUsers,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: userKeys.lists() }),
  });
};
