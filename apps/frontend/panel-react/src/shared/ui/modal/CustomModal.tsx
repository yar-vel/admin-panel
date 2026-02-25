import Fade from "@mui/material/Fade";
import Modal, { ModalProps } from "@mui/material/Modal";
import { FC, useEffect, useState } from "react";
import Backdrop from "@mui/material/Backdrop";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import Container from "@mui/material/Container";

import { theme } from "@/shared/ui/theme";

export const CustomModal: FC<ModalProps> = ({ children, ...props }) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(props.open);
  }, [props.open]);

  return (
    <Modal
      {...props}
      sx={{ display: "flex" }}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          TransitionComponent: Fade,
        },
      }}
    >
      <Fade in={open}>
        <ContainerStyled maxWidth="xs">
          {props.title && (
            <Typography
              component="h1"
              variant="h5"
              align="center"
              sx={{ my: 1 }}
              {...props}
            >
              {props.title}
            </Typography>
          )}
          {children}
        </ContainerStyled>
      </Fade>
    </Modal>
  );
};

const ContainerStyled = styled(Container)`
  max-height: 100%;
  outline: none;
  padding-block: ${theme.spacing(1)};
  padding-inline: ${theme.spacing(2)};
  background-color: ${theme.palette.background.default};
  box-shadow: ${theme.shadows[1]};
  position: relative;
  margin: auto;
`;
