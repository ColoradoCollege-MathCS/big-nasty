'use client';

import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

type VoteData = {
  county_name: string;
  yes_count: number;
  no_count: number;
};

type MapProps = {
  propositionId?: number;
  year?: number;
  voteData: VoteData[];
};

export function PropositionHistogram({ propositionId, year, voteData }: MapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<d3.Selection<HTMLDivElement, unknown, HTMLElement, any>>();

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    // Clear all existing elements from the SVG
    d3.select(svgRef.current).selectAll("*").remove();

    // Create tooltip
    const tooltip = d3.select('body')
      .append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0)
      .style('position', 'absolute')
      .style('background-color', 'white')
      .style('padding', '10px')
      .style('border', '1px solid #ddd')
      .style('border-radius', '4px')
      .style('pointer-events', 'none')
      .style('box-shadow', '0 2px 4px rgba(0,0,0,0.1)')
      .style('color', '#374151')
      .style('font-size', '14px');

    tooltipRef.current = tooltip;

    // Dimensions
    const margin = { top: 10, right: 0, bottom: 50, left: 70 },
      width = 800 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

    // SVG container
    const svg = d3
      .select(svgRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Extract county names
    const counties = voteData.map((d) => d.county_name);

    // Scales
    const x = d3
      .scaleBand()
      .domain(counties)
      .range([0, width])
      .padding(0.2);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(voteData, (d) => d.yes_count + d.no_count) as number])
      .nice()
      .range([height, 0]);

    // Define the keys used by the stack
    type StackKey = 'yes_count' | 'no_count';

    // Create a typed stack
    const stackedData = d3
      .stack<VoteData, StackKey>()
      .keys(['yes_count', 'no_count'])
      (voteData);

    // Create a typed color scale
    const color = d3
      .scaleOrdinal<StackKey, string>()
      .domain(['yes_count', 'no_count'])
      .range(['#7fbf7b', '#af8dc3']);

    // Draw the X-axis
    svg
      .append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x).tickSizeOuter(0))
      .selectAll('text')
      .attr('transform', 'rotate(-45)')
      .style('text-anchor', 'end')
      .style('font-size', '12px');

    // Draw the Y-axis
    svg.append('g').call(d3.axisLeft(y));

    // Bars
    svg
      .append('g')
      .attr('class', 'bars')
      .selectAll('g')
      .data(stackedData)
      .enter()
      .append('g')
      .attr('fill', (d) => color(d.key))
      .selectAll('rect')
      .data((d) => d)
      .enter()
      .append('rect')
      .attr('x', (d) => x(d.data.county_name)!)
      .attr('y', (d) => y(d[1]))
      .attr('height', (d) => y(d[0]) - y(d[1]))
      .attr('width', x.bandwidth())
      .on('mouseenter', function (event: MouseEvent, d) {
        const [mouseX, mouseY] = d3.pointer(event, document.body);
        const { county_name, yes_count, no_count } = d.data;

        d3.select(this).style('opacity', 0.7);

        tooltip
          .style('opacity', 1)
          .html(
            `<div class="font-medium text-gray-900 mb-1">${county_name}</div>
             <div class="text-gray-700">
               Votes For: ${yes_count.toLocaleString()}<br/>
               Votes Against: ${no_count.toLocaleString()}<br/>
               Total Votes: ${(yes_count + no_count).toLocaleString()}</div>`
          )
          .style('left', `${mouseX + 10}px`)
          .style('top', `${mouseY - 20}px`);
      })
      .on('mousemove', function (event: MouseEvent) {
        const [mouseX, mouseY] = d3.pointer(event, document.body);

        tooltip
          .style('left', `${mouseX + 10}px`)
          .style('top', `${mouseY - 20}px`);
      })
      .on('mouseleave', function () {
        d3.select(this).style('opacity', 1);
        tooltip.style('opacity', 0);
      });

    // Clean up tooltips on unmount
    return () => {
      tooltip.remove();
    };
  }, [voteData]);

  return (
    <div ref={containerRef} className="relative w-full h-full">
      <svg ref={svgRef} className="w-full h-full" />
    </div>
  );
}
