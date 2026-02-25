import { useEffect, useState } from "react";

import { useAppSelector } from "../../app/store/hooks";

const defaultRights = {
  creating: false,
  reading: false,
  updating: false,
  deleting: false,
};

export const useRights = (path: string) => {
  const route = path.startsWith("/") ? path.slice(1) : path;
  const [rights, setRights] = useState(defaultRights);
  const profile = useAppSelector((store) => store.main.profile);

  useEffect(() => {
    setRights((prev) => {
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

        if (
          prev.creating !== newRights.creating ||
          prev.reading !== newRights.reading ||
          prev.updating !== newRights.updating ||
          prev.deleting !== newRights.deleting
        )
          return newRights;
      } else {
        return defaultRights;
      }

      return prev;
    });
  }, [profile, route]);

  return rights;
};
