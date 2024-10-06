import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

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
  const [dimensions, setDimensions] = useState({ width: 928, height: 100 });

  useEffect(() => {
    const updateDimensions = () => {
      if (svgRef.current) {
        const { width, height } = svgRef.current.getBoundingClientRect();
        setDimensions({ width, height });
      }
    };

    updateDimensions(); // Set initial dimensions
    window.addEventListener("resize", updateDimensions); // Update on resize

    return () => window.removeEventListener("resize", updateDimensions); // Clean up listener
  }, []);

  useEffect(() => {
    const { width, height } = dimensions;
    const marginTop = 20;
    const marginRight = 30;
    const marginBottom = 30;
    const marginLeft = 40;

    // Create scales
    const x = d3
      .scaleUtc()
      .domain(d3.extent(data, (d) => d.date) as [Date, Date])
      .range([marginLeft, width - marginRight]);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => Math.max(d.open, d.close)) as number])
      .range([height - marginBottom, marginTop]);

    // Create area generators
    const areaOpen = d3
      .area<DataPoint>()
      .x((d) => x(d.date)!)
      .y0(y(0))
      .y1((d) => y(d.open)!);

    const areaClose = d3
      .area<DataPoint>()
      .x((d) => x(d.date)!)
      .y0((d) => y(d.open)!)
      .y1((d) => y(d.close)!);

    // Select the SVG and set attributes
    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("style", "max-width: 100%; height: auto;");

    // Clear previous content
    svg.selectAll("*").remove();

    // Append the open area
    svg.append("path").datum(data).attr("fill", "#d0f5ec").attr("d", areaOpen);

    // Append the close area
    svg.append("path").datum(data).attr("fill", "#faba82").attr("d", areaClose);
  }, [data, dimensions]); // Update when data or dimensions change

  return <svg ref={svgRef} style={{ width: "100%", height: "100%" }}></svg>;
};

export default AreaChart;
