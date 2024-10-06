import Close from "@mui/icons-material/Close";
import {
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  Tab,
  Tabs,
  Toolbar,
  Typography,
} from "@mui/material";
import React from "react";
import AreaChart from "./components/AreaChart";
import { data as _data } from "./data";

function App() {
  const [open, setOpen] = React.useState(true);
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  const data = _data.map((item) => ({
    date: new Date(item.date),
    open: item.open,
    close: item.close,
  }));

  return (
    <>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100%"
        bgcolor="red"
      >
        <Button onClick={() => setOpen(true)} variant="outlined">
          Click Me
        </Button>
      </Box>
      <Drawer anchor="right" variant="temporary" open={open}>
        <Box sx={{ width: { xs: "100vw", md: "80vw" } }}>
          <Toolbar>
            <Typography
              variant="h6"
              component="div"
              sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
            >
              ml-deploy
            </Typography>
            <IconButton onClick={() => setOpen(false)}>
              <Close />
            </IconButton>
          </Toolbar>
          <Divider />
          <Tabs
            value={value}
            onChange={handleChange}
            variant="scrollable"
            scrollButtons="auto"
            aria-label="scrollable auto tabs"
          >
            <Tab label={<Typography>list-timeline Logs</Typography>} />
            <Tab label={<Typography>chart-line-up Metrics</Typography>} />
            <Tab label={<Typography>bell-exclamation Events</Typography>} />
          </Tabs>
          <Divider />
          <Box height={100}>
            <AreaChart data={data} />
          </Box>
        </Box>
      </Drawer>
    </>
  );
}

export default App;
