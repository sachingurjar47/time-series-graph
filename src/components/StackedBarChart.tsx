import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

interface DataPoint {
  date: Date;
  open: number;
  close: number;
}

interface Props {
  data: DataPoint[];
}

const StackedBarChart: React.FC<Props> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();
    const margin = { top: 20, right: 30, bottom: 40, left: 40 };
    const width = 1200 - margin.left - margin.right;
    const height = 600 - margin.top - margin.bottom;
    const sortedData = data.sort((a, b) => a.date.getTime() - b.date.getTime());

    const stack = d3.stack<DataPoint>().keys(["open", "close"]);
    const stackedData = stack(sortedData);

    const xScale = d3
      .scaleUtc()
      .domain(d3.extent(sortedData, (d) => d.date) as [Date, Date])
      .range([0, width]);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(stackedData, (layer) => d3.max(layer, (d) => d[1]))!])
      .nice()
      .range([height, 0]);

    const color = d3
      .scaleOrdinal<string>()
      .domain(["open", "close"])
      .range(["#ff6384", "#36a2eb"]);

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    g.selectAll("g")
      .data(stackedData)
      .enter()
      .append("g")
      .attr("fill", (d) => color(d.key))
      .selectAll("rect")
      .data((d) => d)
      .enter()
      .append("rect")
      .attr("x", (d) => xScale(d.data.date))
      .attr("y", (d) => yScale(d[1]))
      .attr("height", (d) => {
        const heightValue = yScale(d[0]) - yScale(d[1]);
        return heightValue > 0 ? heightValue : 0;
      })
      .attr("width", (d, i) => {
        const currentDate = d.data.date;
        const nextDate = sortedData[i + 1]
          ? sortedData[i + 1].date
          : currentDate;
        return xScale(nextDate) - xScale(currentDate);
      });

    // X-axis
    g.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(
        d3
          .axisBottom(xScale)
          .ticks(width / 40)
          .tickSizeOuter(0)
      );

    g.append("g").attr("class", "axis y-axis").call(d3.axisLeft(yScale));
  }, [data]);

  return <svg ref={svgRef} width={1200} height={600} />;
};

export default StackedBarChart;
