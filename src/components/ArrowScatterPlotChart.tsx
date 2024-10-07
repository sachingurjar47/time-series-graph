import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import useResizeObserver from "../hooks/useResizeObserver";
import { Box } from "@mui/material";

interface DataPoint {
  x: number;
  arrow: "up" | "down";
  color?: string;
}

interface ArrowScatterPlotChartProps {
  color?: { up: string; down: string };
  data: DataPoint[];
}
const ArrowScatterPlotChart: React.FC<ArrowScatterPlotChartProps> = ({
  color = { up: "#059669", down: "#F87171" },
  data,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const dimensions = useResizeObserver(wrapperRef);
  const [tooltip, setTooltip] = useState<{
    visible: boolean;
    x: number;
    data?: { left: DataPoint | null; right: DataPoint | null };
  }>({
    visible: false,
    x: 0,
  });

  useEffect(() => {
    const { width, height } =
      dimensions || wrapperRef?.current!.getBoundingClientRect();
    const margin = { top: 0, right: 20, bottom: 0, left: 20 };

    const x = d3
      .scaleLinear()
      .domain(d3.extent(data, (d) => d.x) as [number, number])
      .nice()
      .range([margin.left, width - margin.right]);

    const y = d3
      .scaleLinear()
      .domain(d3.extent(data, (d) => 0) as [number, number])
      .nice()
      .range([height - margin.bottom, margin.top]);
    const svg = d3
      .select(svgRef.current)
      .attr("viewBox", [0, 0, width, height])
      .attr("width", width)
      .attr("height", height)
      .attr("style", "max-width: 100%; height: auto;");
    svg.selectAll("*").remove();
    const grid = svg
      .append("g")
      .attr("stroke", "currentColor")
      .attr("stroke-opacity", 0.1);

    grid
      .selectAll("line.x")
      .data(x.ticks())
      .enter()
      .append("line")
      .attr("class", "x")
      .attr("x1", (d) => x(d))
      .attr("x2", (d) => x(d))
      .attr("y1", margin.top)
      .attr("y2", height - margin.bottom);

    grid
      .selectAll("line.y")
      .data(y.ticks())
      .enter()
      .append("line")
      .attr("class", "y")
      .attr("y1", (d) => y(d))
      .attr("y2", (d) => y(d))
      .attr("x1", margin.left)
      .attr("x2", width - margin.right);

    const points = svg
      .append("g")
      .attr("stroke-width", 1.5)
      .attr("font-family", "sans-serif")
      .attr("font-size", 10);

    points
      .selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("transform", (d) => `translate(${x(d.x)},${y(0)})`)
      .attr("fill", (d) => (d?.color ? d.color : color?.[d.arrow]))
      .attr("r", 10);

    points
      .selectAll("path")
      .data(data)
      .enter()
      .append("path")
      .attr("transform", (d) => `translate(${x(d.x)},${y(0)})`)
      .attr("fill", "white")
      .attr("d", (d) =>
        d.arrow === "down"
          ? "M0,5 L4,0 H2 V-5 H-2 V0 H-4 Z"
          : "M0,-5 L-4,0 H-2 V5 H2 V0 H4 Z"
      );

    svg
      .on("mousemove", (event) => {
        const [mouseX] = d3.pointer(event);

        const closestPoints = data.reduce(
          (acc, curr) => {
            const currDistance = Math.abs(x(curr.x) - mouseX);
            if (!acc.left || currDistance < Math.abs(x(acc.left.x) - mouseX)) {
              acc.right = acc.left;
              acc.left = curr;
            } else if (
              !acc.right ||
              currDistance < Math.abs(x(acc.right.x) - mouseX)
            ) {
              acc.right = curr;
            }
            return acc;
          },
          { left: null as DataPoint | null, right: null as DataPoint | null }
        );

        setTooltip({
          visible: closestPoints.left || closestPoints.right ? true : false,
          x: closestPoints.left || closestPoints.right ? mouseX + 10 : 0,

          data: closestPoints,
        });
      })
      .on("mouseleave", () => {
        setTooltip({ visible: false, x: 0 });
      });

    return () => {
      svg.selectAll("*").remove();
    };
  }, [data, dimensions]);
  return (
    <Box
      height="100%"
      ref={wrapperRef}
      width="100%"
      style={{ position: "relative" }}
    >
      <svg ref={svgRef} />
      {tooltip.visible && tooltip.data && (
        <div
          style={{
            position: "absolute",
            left: tooltip.x,
            top: 0,
            backgroundColor: "white",
            border: "1px solid #ccc",
            padding: "5px",
            borderRadius: "3px",
            pointerEvents: "none",
            zIndex: 999,
          }}
        >
          {tooltip.data.left && (
            <>
              <strong>Left Point:</strong>
              <br />
              <strong>X:</strong> {tooltip.data.left.x}
              <br />
            </>
          )}
          {tooltip.data.right && (
            <>
              <strong>Right Point:</strong>
              <br />
              <strong>X:</strong> {tooltip.data.right.x}
              <br />
            </>
          )}
        </div>
      )}
    </Box>
  );
};

export default ArrowScatterPlotChart;
