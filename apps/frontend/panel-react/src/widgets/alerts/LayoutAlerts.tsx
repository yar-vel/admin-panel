import Snackbar from "@mui/material/Snackbar";
import { FC, useState } from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";

import { theme } from "@/shared/ui/theme";
import { IAlert } from "@workspace/shared";
import { useAlertsStore } from "@/shared/model/useAlertsStore";

export const LayoutAlerts: FC = () => {
  const alerts = useAlertsStore((store) => store.alerts);
  const removeAlert = useAlertsStore((store) => store.removeAlert);
  const [closedAlerts, setClosedAlerts] = useState<Set<IAlert["id"]>>(
    () => new Set(),
  );

  const handleClose = (id: IAlert["id"], reason?: string) => {
    if (reason !== "clickaway") {
      const newSet = new Set<IAlert["id"]>(closedAlerts);
      newSet.add(id);
      setClosedAlerts(newSet);
    }
  };

  const handleDelete = (id: IAlert["id"]) => {
    if (closedAlerts.has(id)) {
      removeAlert(id);
      closedAlerts.delete(id);
    }
  };

  return (
    <AlertsContainer>
      {alerts.map((alert) => (
        <Snackbar
          key={alert.id}
          open={!closedAlerts.has(alert.id)}
          autoHideDuration={5000}
          sx={{ py: 1 }}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          onClose={(_, reason) => handleClose(alert.id, reason)}
          onTransitionEnd={() => handleDelete(alert.id)}
        >
          <Alert
            onClose={() => handleClose(alert.id)}
            severity={alert.type}
            variant="filled"
            sx={{ whiteSpace: "break-spaces" }}
          >
            {alert.text}
          </Alert>
        </Snackbar>
      ))}
    </AlertsContainer>
  );
};

const AlertsContainer = styled(Box)`
  position: fixed;
  bottom: 0;
  right: 0;
  overflow: hidden;
  width: 100%;
  max-width: 300px;
  padding-inline: ${theme.spacing(2)};
  padding-block: ${theme.spacing(1)};
  z-index: 9999;
  & > .MuiSnackbar-root {
    position: relative;
    bottom: auto;
    right: auto;
    left: auto;
    width: 100%;
    & > .MuiPaper-root {
      width: 100%;
    }
  }
`;
