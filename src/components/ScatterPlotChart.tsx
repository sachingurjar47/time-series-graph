import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import useResizeObserver from "../hooks/useResizeObserver";
import { Box } from "@mui/material";

interface DataPoint {
  x: number;
  species?: d3.SymbolType;
  color?: string;
}

interface ScatterPlotChartProps {
  shape?: d3.SymbolType;
  color?: string;
  data: DataPoint[];
}
const ScatterPlotChart: React.FC<ScatterPlotChartProps> = ({
  shape = d3.symbolCircle,
  color = "#3B82F6",
  data,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const dimensions = useResizeObserver(wrapperRef);
  const [tooltip, setTooltip] = useState<{
    visible: boolean;
    x: number;
    y: number;
    data?: { left: DataPoint | null; right: DataPoint | null };
  }>({
    visible: false,
    x: 0,
    y: 0,
  });

  useEffect(() => {
    const { width, height } =
      dimensions || wrapperRef?.current!.getBoundingClientRect();
    const margin = { top: 25, right: 20, bottom: 35, left: 40 };

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

    const getShape = (d: DataPoint) => d3.symbol().type(d.species || shape)();
    const svg = d3
      .select(svgRef.current)
      .attr("viewBox", [0, 0, width, height])
      .attr("width", width)
      .attr("height", height)
      .attr("style", "max-width: 100%; height: auto; ");
    svg.selectAll("*").remove();
    const grid = svg
      .append("g")
      .attr("stroke", "currentColor")
      .attr("stroke-opacity", 0.1);

    grid
      .append("g")
      .selectAll("line")
      .data(y.ticks())
      .join("line")
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
      .selectAll("path")
      .data(data)
      .join("path")
      .attr("transform", (d) => `translate(${x(d.x)},${y(0)})`)
      .attr("fill", (d) => d.color || color)
      .attr("d", getShape);

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

        if (closestPoints.left || closestPoints.right) {
          setTooltip({
            visible: true,
            x: mouseX + 10,
            y: 10,
            data: closestPoints,
          });
        } else {
          setTooltip({ visible: false, x: 0, y: 0 });
        }
      })
      .on("mouseleave", () => {
        setTooltip({ visible: false, x: 0, y: 0 });
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
            top: tooltip.y,
            backgroundColor: "white",
            border: "1px solid #ccc",
            padding: "5px",
            borderRadius: "3px",
            pointerEvents: "none",
            zIndex: 9999,
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

export default ScatterPlotChart;
