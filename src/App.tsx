import Close from "@mui/icons-material/Close";
import * as d3 from "d3";
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
import ScatterPlotChart from "./components/ScatterPlotChart";
import AreaChart from "./components/AreaChart";
import ArrowScatterPlotChart from "./components/ArrowScatterPlotChart";
import StackedBarChart from "./components/StackedBarChart";
import { data as _data, podsLifeCycle } from "./data";
import BoxTooltip from "./components/BoxTooltip";
import TimeLine from "./components/TimeLine";
import Grid from "./components/Grid";
import Table from "./components/Table";

function App() {
  const [open, setOpen] = React.useState(false);
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
      >
        <Button onClick={() => setOpen(true)} variant="outlined">
          Click Me
        </Button>
      </Box>
      <Drawer anchor="right" variant="temporary" open={open}>
        <Box
          sx={{
            width: { xs: "100vw", md: "80vw" },
          }}
        >
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
          <Grid
            container
            sx={{
              border: "1px solid #A8C3E8",
              margin: "1rem",
              borderRadius: "1rem",
              overflow: "hidden",
            }}
          >
            <Grid p={1} size={{ xs: 12, md: 4, lg: 2 }}>
              <BoxTooltip>Request Traffic</BoxTooltip>
            </Grid>
            <Grid
              height={60}
              size={{ xs: 12, md: 8, lg: 10 }}
              border="1px solid #A8C3E8"
            >
              <AreaChart data={data} />
            </Grid>
            <Grid
              p={1}
              size={{ xs: 12, md: 4, lg: 2 }}
              border="1px solid #A8C3E8"
            >
              <BoxTooltip>Pods</BoxTooltip>
            </Grid>
            <Grid
              height={40}
              size={{ xs: 12, md: 8, lg: 10 }}
              border="1px solid #A8C3E8"
            >
              <StackedBarChart data={_data.slice(20, 50)} />
            </Grid>
            <Grid container size={12} border="1px solid #A8C3E8">
              <Grid p={1} size={{ xs: 12, md: 4, lg: 2 }}>
                <BoxTooltip>{podsLifeCycle.title}</BoxTooltip>
              </Grid>
              <Grid height={40} size={{ xs: 12, md: 8, lg: 10 }}>
                <ArrowScatterPlotChart data={podsLifeCycle.data} />
              </Grid>
              {podsLifeCycle?.containers?.map((item) => (
                <>
                  <Grid sx={{ p: { md: 1 } }} size={{ xs: 12, md: 4, lg: 2 }}>
                    <BoxTooltip pl={2}>{item.title}</BoxTooltip>
                  </Grid>
                  <Grid height={40} size={{ xs: 12, md: 8, lg: 10 }}>
                    <ArrowScatterPlotChart data={item.data} />
                  </Grid>
                </>
              ))}
            </Grid>{" "}
            <Grid container size={12} border="1px solid #A8C3E8">
              <Grid p={1} size={{ xs: 12, md: 4, lg: 2 }}>
                <BoxTooltip>ContainerHighCpuUtilization</BoxTooltip>
              </Grid>
              <Grid height={40} size={{ xs: 12, md: 8, lg: 10 }}>
                <ScatterPlotChart
                  shape={d3.symbolDiamond}
                  data={new Array(5)
                    .fill(0)
                    ?.map((d, i) =>
                      i % 2 === 0
                        ? { x: 10 * i, color: "#F87171" }
                        : { x: 10 * i, color: "#059669" }
                    )}
                />
              </Grid>
              {/*  */}
              <Grid p={1} size={{ xs: 12, md: 4, lg: 2 }}>
                <BoxTooltip>ContainerHighMemoryUsage</BoxTooltip>
              </Grid>
              <Grid height={40} size={{ xs: 12, md: 8, lg: 10 }}>
                <ScatterPlotChart
                  shape={d3.symbolDiamond}
                  data={new Array(10)
                    .fill(0)
                    ?.map((d, i) =>
                      i % 2 === 0
                        ? { x: 10 * i, color: "#F87171" }
                        : { x: 10 * i, color: "#059669" }
                    )}
                />
              </Grid>
              {/*  */}
              <Grid p={1} size={{ xs: 12, md: 4, lg: 2 }}>
                <BoxTooltip>ContainerVolumeUsage</BoxTooltip>
              </Grid>
              <Grid height={40} size={{ xs: 12, md: 8, lg: 10 }}>
                <ScatterPlotChart
                  shape={d3.symbolDiamond}
                  data={new Array(15)
                    .fill(0)
                    ?.map((d, i) =>
                      i % 3 === 0
                        ? { x: 10 * i, color: "#F87171" }
                        : { x: 10 * i, color: "#059669" }
                    )}
                />
              </Grid>
              {/*  */}
              <Grid p={1} size={{ xs: 12, md: 4, lg: 2 }}>
                <BoxTooltip>ContainerHighThrottleRate</BoxTooltip>
              </Grid>
              <Grid height={40} size={{ xs: 12, md: 8, lg: 10 }}>
                <ScatterPlotChart
                  shape={d3.symbolDiamond}
                  data={new Array(10)
                    .fill(0)
                    ?.map((d, i) =>
                      i % 3 === 0
                        ? { x: 1 * i, color: "#F87171" }
                        : { x: 5 * i, color: "#059669" }
                    )}
                />
              </Grid>
            </Grid>
            <Grid
              p={1}
              size={{ xs: 12, md: 4, lg: 2 }}
              // border="1px solid #A8C3E8"
            >
              <BoxTooltip>Human Changes</BoxTooltip>
            </Grid>
            <Grid
              height={40}
              size={{ xs: 12, md: 8, lg: 10 }}
              border="1px solid #A8C3E8"
            >
              <ScatterPlotChart data={podsLifeCycle.data} />
            </Grid>{" "}
            <Grid
              p={1}
              size={{ xs: 12, md: 4, lg: 2 }}
              border="1px solid #A8C3E8"
            >
              <Typography sx={{ color: "#A8C3E8" }}>TIMELINE</Typography>
            </Grid>
            <Grid
              height={40}
              size={{ xs: 12, md: 8, lg: 10 }}
              // border="1px solid #A8C3E8"
            >
              <TimeLine data={data} />
            </Grid>
          </Grid>
          <Table />
        </Box>
      </Drawer>
    </>
  );
}

export default App;
