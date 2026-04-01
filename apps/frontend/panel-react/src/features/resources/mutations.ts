import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  createResource,
  deleteResources,
  updateResource,
} from "@/entities/resource/api";
import { resourceKeys } from "@/entities/resource/keys";

export const useCreateResourceMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createResource,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: resourceKeys.lists() }),
  });
};

export const useUpdateResourceMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateResource,
    onSuccess: (_, { id }) =>
      queryClient.invalidateQueries({ queryKey: resourceKeys.detail(id) }),
  });
};

export const useDeleteResourcesMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteResources,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: resourceKeys.lists() }),
  });
};
