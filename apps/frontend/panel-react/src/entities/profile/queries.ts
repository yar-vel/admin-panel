import { useQuery } from "@tanstack/react-query";

import { getProfile, getSessions } from "./api";
import { profileKeys } from "./keys";

export const useProfileQuery = (headers?: HeadersInit) =>
  useQuery({
    queryKey: profileKeys.profile(),
    queryFn: () => getProfile(headers),
  });

export const useSessionsQuery = (headers?: HeadersInit) =>
  useQuery({
    queryKey: profileKeys.sessions(),
    queryFn: () => getSessions(headers),
  });
