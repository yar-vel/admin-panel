import { useQueryClient, useMutation } from "@tanstack/react-query";

import {
  createRole,
  updateRole,
  updateRoleRights,
  deleteRoles,
} from "@/entities/role/api";
import { roleKeys } from "@/entities/role/keys";

export const useCreateRoleMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createRole,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: roleKeys.lists() }),
  });
};

export const useUpdateRoleMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateRole,
    onSuccess: (_, { id }) =>
      queryClient.invalidateQueries({ queryKey: roleKeys.detail(id) }),
  });
};

export const useUpdateRoleRightsMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateRoleRights,
    onSuccess: (_, { id }) =>
      queryClient.invalidateQueries({ queryKey: roleKeys.detail(id) }),
  });
};

export const useDeleteRolesMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteRoles,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: roleKeys.lists() }),
  });
};
