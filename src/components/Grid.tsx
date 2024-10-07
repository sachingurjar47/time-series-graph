import React from "react";
import { Grid2, Grid2Props } from "@mui/material";

const Grid: React.FC<Grid2Props> = (props) => {
  return (
    <Grid2
      alignItems="center"
      {...props}
      sx={{
        ...props.sx,
        borderRight: { md: "1px solid #A8C3E8" },
      }}
    />
  );
};

export default Grid;
