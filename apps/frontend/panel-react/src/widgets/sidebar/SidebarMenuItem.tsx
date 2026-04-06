import { FC, ReactNode, useMemo, useState } from "react";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import Collapse from "@mui/material/Collapse";
import ExpandMore from "@mui/icons-material/ExpandMore";
import ExpandLess from "@mui/icons-material/ExpandLess";
import { usePathname } from "next/navigation";
import Link from "next/link";

import { checkActiveLink, IMenuItem } from "@workspace/shared";

export const SidebarMenuItem: FC<IMenuItem<ReactNode>> = ({
  href,
  title,
  icon,
  childs,
}) => {
  const pathname = usePathname();
  const [opened, setOpened] = useState(
    () => checkActiveLink(pathname, { href, childs }),
  );

  const selected = useMemo(() => {
    let result = Boolean(href);
    const pathArr = pathname.split("/");
    const linkArr = href?.split("/") ?? [];
    linkArr.forEach((value, index) => {
      if (value != pathArr[index]) {
        result = false;
      }
    });

    return result;
  }, [pathname, href]);

  return (
    <>
      <ListItem disablePadding>
        <ListItemButton
          selected={selected}
          onClick={() => setOpened(prev => !prev)}
          LinkComponent={href ? Link : undefined}
          {...(href && { href })}
        >
          {icon && <ListItemIcon>{icon}</ListItemIcon>}
          <ListItemText primary={title} />
          {childs && (opened ? <ExpandLess /> : <ExpandMore />)}
        </ListItemButton>
      </ListItem>
      {childs && (
        <Collapse in={opened} timeout="auto">
          <Divider />
          {childs.map((item) => (
            <SidebarMenuItem
              key={`sbmi:${item.title}:${item.href}`}
              {...item}
            />
          ))}
        </Collapse>
      )}
    </>
  );
};
