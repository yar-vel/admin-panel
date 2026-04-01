import { FC, SubmitEventHandler, useState } from "react";
import { UAParser } from "ua-parser-js";
import DeleteIcon from "@mui/icons-material/Delete";
import ComputerIcon from "@mui/icons-material/Computer";
import SmartphoneIcon from "@mui/icons-material/Smartphone";
import {
  Card,
  CardActions,
  CardContent,
  Chip,
  IconButton,
  styled,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";

import { FormBase } from "@/shared/ui/form/FormBase";
import { theme } from "@/shared/ui/theme";
import { useRights } from "@/shared/hooks/useRights";
import {
  getDateString,
  getErrorText,
  TSessionExternal,
} from "@workspace/shared";
import { ROUTES } from "@workspace/shared";
import { useDeleteSessionsMutation } from "./mutations";
import { useAlertsStore } from "@/shared/model/useAlertsStore";

export const SessionForm: FC<{
  session: TSessionExternal;
  onDelete?: () => void;
}> = ({ session, onDelete }) => {
  const { t, i18n } = useTranslation();
  const rights = useRights(ROUTES.api.profile._);
  const [userAgent] = useState(() =>
    new UAParser(session.userAgent).getResult(),
  );
  const deleteSessions = useDeleteSessionsMutation();
  const addAlert = useAlertsStore((s) => s.addAlert);

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    deleteSessions.mutate(
      { items: [session.id] },
      {
        onSuccess: () => {
          addAlert({ type: "success", text: t("success") });
          onDelete?.();
        },
        onError: (error) =>
          addAlert({ type: "error", text: getErrorText(error, i18n.language) }),
      },
    );
  };

  return (
    <FormBase onSubmit={handleSubmit}>
      <Session>
        <SessionContent>
          {userAgent.device.vendor ? (
            <>
              <SmartphoneIcon sx={{ mr: 1 }} />
              <Typography component="span" variant="body2">
                {userAgent.device.vendor} {userAgent.device.model}
                {","}&nbsp;
              </Typography>
            </>
          ) : (
            <>
              <ComputerIcon sx={{ mr: 1 }} />
              <Typography component="span" variant="body2">
                {userAgent.os.name} {userAgent.os.version}
                {","}&nbsp;
              </Typography>
            </>
          )}
          <Typography component="span" variant="body2">
            {userAgent.browser.name} {userAgent.browser.version}
            {","}&nbsp;
          </Typography>
          <Typography component="span" variant="body2" sx={{ opacity: 0.8 }}>
            {session.ip}
            {","}&nbsp;
          </Typography>
          <Typography
            component="span"
            variant="body2"
            sx={{ mr: 1, opacity: 0.6 }}
          >
            {getDateString(session.updatedAt)}
          </Typography>
          {session.current && (
            <Chip
              label={t("current")}
              color="success"
              variant="outlined"
              size="small"
            />
          )}
        </SessionContent>
        <CardActions sx={{ pr: 2 }}>
          <IconButton
            edge="end"
            color="error"
            aria-label="sign out"
            title={t("signOut")}
            disabled={
              !rights.updating ||
              deleteSessions.isPending ||
              deleteSessions.isSuccess ||
              session.current
            }
            type="submit"
          >
            <DeleteIcon />
          </IconButton>
        </CardActions>
      </Session>
    </FormBase>
  );
};

const Session = styled(Card)`
  display: flex;
  flex-direction: row;
  margin-bottom: ${theme.spacing(1)};
`;

const SessionContent = styled(CardContent)`
  flex-grow: 1;
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-wrap: wrap;
`;
