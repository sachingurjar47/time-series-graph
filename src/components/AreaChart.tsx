import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import useResizeObserver from "../hooks/useResizeObserver";
import { Box } from "@mui/material";

interface DataPoint {
  date: Date;
  open: number;
  close: number;
}

interface AreaChartProps {
  data: DataPoint[];
}

const AreaChart: React.FC<AreaChartProps> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const dimensions = useResizeObserver(wrapperRef);
  useEffect(() => {
    const { width, height } =
      dimensions || wrapperRef?.current!.getBoundingClientRect();
    const marginTop = 0;
    const marginRight = 0;
    const marginBottom = 0;
    const marginLeft = 0;
    const x = d3
      .scaleUtc()
      .domain(d3.extent(data, (d) => d.date) as [Date, Date])
      .range([marginLeft, width - marginRight]);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => Math.max(d.open, d.close)) as number])
      .range([height - marginBottom, marginTop]);
    const areaOpen = d3
      .area<DataPoint>()
      .x((d) => x(d.date)!)
      .y0(y(0))
      .y1((d) => y(d.open)!);

    const areaClose = d3
      .area<DataPoint>()
      .x((d) => x(d.date)!)
      .y0((d) => y(0)!)
      .y1((d) => y(d.close)!);

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("style", "max-width: 100%; height: auto;");
    svg.selectAll("*").remove();

    svg
      .append("path")
      .datum(data)

      .attr("fill", "#cae0fc")
      .attr("stroke", "#2c62e5")
      .attr("d", areaOpen);

    svg
      .append("path")
      .datum(data)
      .attr("fill", "#f7b5b5")
      .attr("stroke", "red")
      .attr("d", areaClose);
  }, [data, dimensions]);

  return (
    <Box height="100%" ref={wrapperRef} width="100%">
      <svg ref={svgRef} />
    </Box>
  );
};

export default AreaChart;
