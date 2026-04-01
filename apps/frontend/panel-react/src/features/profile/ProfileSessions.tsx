import { FC, useEffect, useState } from "react";
import Skeleton from "@mui/material/Skeleton";
import { useTranslation } from "react-i18next";

import { SessionForm } from "@/features/profile/SessionForm";
import { getErrorText, TSessionExternal } from "@workspace/shared";
import { useAlertsStore } from "@/shared/model/useAlertsStore";
import { useSessionsQuery } from "@/entities/profile/queries";

export const ProfileSessions: FC = () => {
  const { i18n } = useTranslation();
  const addAlert = useAlertsStore((s) => s.addAlert);
  const sessions = useSessionsQuery();
  const [deletedSessions, setDeletedSessions] = useState<TSessionExternal[]>(
    [],
  );

  useEffect(() => {
    if (sessions.error) {
      addAlert({
        type: "error",
        text: getErrorText(sessions.error, i18n.language),
      });
    }
  }, [addAlert, sessions.error, i18n]);

  return (
    <>
      {sessions.isLoading && (
        <Skeleton variant="rounded" width="100%" height={56} sx={{ mb: 1 }} />
      )}
      {sessions.data
        ?.filter((s) => !deletedSessions.includes(s))
        .map((session) => (
          <SessionForm
            key={session.id}
            session={session}
            onDelete={() => setDeletedSessions(deletedSessions.concat(session))}
          />
        ))}
    </>
  );
};
