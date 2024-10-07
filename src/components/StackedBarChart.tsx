import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import useResizeObserver from "../hooks/useResizeObserver";
import { Box } from "@mui/material";

interface DataPoint {
  date: string;
  open: number;
  close: number;
}

interface Props {
  data: DataPoint[];
}

const StackedBarChart: React.FC<Props> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const dimensions = useResizeObserver(wrapperRef);

  useEffect(() => {
    const { width, height } =
      dimensions || wrapperRef?.current!.getBoundingClientRect();
    const marginTop = 0;
    const marginLeft = 0;
    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .attr("style", "max-width: 100%; height: auto;");
    svg.selectAll("*").remove();

    const stack = d3.stack<DataPoint>().keys(["open", "close"]);
    const stackedData = stack(data.map((d) => ({ ...d, date: d.date })));

    const x = d3
      .scaleBand<number>()
      .domain(data.map((_, i) => i))
      .range([0, width])
      .padding(0.1);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(stackedData, (layer) => d3.max(layer, (d) => d[1]))!])
      .nice()
      .range([height, 0]);

    const color = d3
      .scaleOrdinal<string>()
      .domain(["open", "close"])
      .range(["#F59E0B", "#059669"]);

    const g = svg
      .append("g")
      .attr("transform", `translate(${marginLeft},${marginTop})`);

    g.selectAll("g.layer")
      .data(stackedData)
      .enter()
      .append("g")
      .attr("class", "layer")
      .attr("fill", (d) => color(d.key))
      .selectAll("rect")
      .data((d) => d)
      .enter()
      .append("rect")
      .attr("x", (_, i) => x(i)!)
      .attr("y", (d) => yScale(d[1]))
      .attr("height", (d) => yScale(d[0]) - yScale(d[1]))
      .attr("width", x.bandwidth());
  }, [data, dimensions]);

  return (
    <Box height="100%" ref={wrapperRef} width="100%">
      <svg ref={svgRef} />
    </Box>
  );
};

export default StackedBarChart;
