import React from "react";
import { Box, BoxProps, Tooltip } from "@mui/material";
import { InfoOutlined } from "@mui/icons-material";
interface Props extends Omit<BoxProps, "title"> {
  title?: BoxProps["children"];
}
const BoxTooltip: React.FC<Props> = ({ children, title, ...rest }) => {
  return (
    <Box
      display="flex"
      flexDirection="row"
      alignItems="center"
      gap={1}
      {...rest}
      sx={{ ...rest.sx, fontWeight: 900 }}
    >
      <Box>{children}</Box>
      <Tooltip title={title || children}>
        <InfoOutlined />
      </Tooltip>
    </Box>
  );
};

export default BoxTooltip;
