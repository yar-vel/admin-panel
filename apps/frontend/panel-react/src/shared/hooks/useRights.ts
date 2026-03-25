import { useMemo } from "react";

import { useProfileStore } from "@/entities/profile/store";

const defaultRights = {
  creating: false,
  reading: false,
  updating: false,
  deleting: false,
};

export const useRights = (path: string) => {
  const route = path.startsWith("/") ? path.slice(1) : path;
  const profile = useProfileStore((s) => s.profile);

  const rights = useMemo(() => {
    if (profile?.roles) {
      const roles = Array.isArray(profile.roles)
        ? profile.roles
        : [profile.roles];

      const newRights = { ...defaultRights };

      for (const role of roles) {
        if (role.admin) {
          newRights.creating = true;
          newRights.reading = true;
          newRights.updating = true;
          newRights.deleting = true;
          break;
        }

        if (role.rights) {
          for (const right of role.rights) {
            if (right.resource?.path !== route) {
              continue;
            }

            newRights.creating = right.creating;
            newRights.reading = right.reading;
            newRights.updating = right.updating;
            newRights.deleting = right.deleting;
          }
        }
      }

      return newRights;
    }

    return defaultRights;
  }, [profile, route]);

  return rights;
};
