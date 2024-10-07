import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import useResizeObserver from "../hooks/useResizeObserver";
import { Box } from "@mui/material";
interface DataPoint {
  date: Date;
  open: number;
  close: number;
}

interface TimeLineProps {
  data: DataPoint[];
}
const TimeLine: React.FC<TimeLineProps> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const dimensions = useResizeObserver(wrapperRef);
  useEffect(() => {
    const { width, height } =
      dimensions || wrapperRef?.current!.getBoundingClientRect();
    const marginRight = 40;
    const marginBottom = 30;
    const marginLeft = 40;
    const x = d3
      .scaleUtc()
      .domain(d3.extent(data, (d) => d.date) as [Date, Date])
      .range([marginLeft, width - marginRight]);
    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .attr("style", "max-width: 100%; height: auto; color: #6F8EBD;");
    svg.selectAll("*").remove();
    svg
      .append("g")
      .attr("transform", `translate(0,${height - marginBottom})`)
      .call(
        d3
          .axisBottom(x)
          .ticks(width / 100)
          .tickSizeOuter(0)
      );
    svg.selectAll("path").remove();
    svg.selectAll("line").remove();
  }, [data, dimensions]);

  return (
    <Box height="100%" ref={wrapperRef} width="100%">
      <svg ref={svgRef} />
    </Box>
  );
};

export default TimeLine;
