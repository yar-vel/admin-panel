import { styled } from "@mui/material/styles";
import {
  default as MUILink,
  LinkProps as MUILinkProps,
} from "@mui/material/Link";
import Link, { LinkProps } from "next/link";
import { FC, PropsWithChildren } from "react";

import { theme } from "@/shared/ui/theme";

export const FormLink: FC<
  PropsWithChildren & Omit<LinkProps, "as"> & { mui: MUILinkProps }
> = ({ children, mui, ...props }) => {
  return (
    <LinkStyled passHref {...props}>
      <MUILink component="span" display="block" {...mui}>
        {children}
      </MUILink>
    </LinkStyled>
  );
};

const LinkStyled = styled(Link)`
  display: block;
  margin-block: ${theme.spacing(1)};
`;
