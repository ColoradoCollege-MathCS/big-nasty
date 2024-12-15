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
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    console.log("in hist, voteData is: ", voteData);
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

    svg
      .append('defs')
      .append('pattern')
      .attr('id', 'diagonalHatch_hover')
      .attr('patternUnits', 'userSpaceOnUse')
      .attr('width', 4)
      .attr('height', 4)
      .append('path')
      .attr('d', 'M-1,1 l2,-2 M0,4 l4,-4 M3,5 l2,-2')
      .attr('stroke', '#ccc')
      .attr('stroke-width', 0.4);

    // clipPath for zooming/panning
    svg
      .append('defs')
      .append('clipPath')
      .attr('id', 'clip')
      .append('rect')
      .attr('width', width)
      .attr('height', height + 100)
      .attr('x', 0)
      .attr('y', 0);

    const scatter = svg
      .append('g')
      .attr('clip-path', 'url(#clip)');

    // X-axis label
    const xAxisLabel = svg
      .append('text')
      .attr('class', 'x-axis-label')
      .attr('x', width / 2)
      .attr('y', height + 35)
      .attr('text-anchor', 'middle')
      .style('font-size', '24px')
      .style('font-weight', 'bold')
      .text('Counties');

    // X-axis
    scatter
      .append('g')
      .attr('class', 'x-axis')
      .attr('transform', 'translate(0,' + height + ')')
      .call(d3.axisBottom(x).tickSizeOuter(0))
      .selectAll('text')
      .attr('transform', 'rotate(-45)')
      .style('text-anchor', 'end')
      .style('font-size', '12px')
      .style('font-weight', 'bold')
      .style('opacity', '0');

    // Y-axis label
    const yAxisLabel = svg
      .append('text')
      .attr('class', 'y-axis-label')
      .attr('x', -height / 2)
      .attr('y', -margin.left + 20)
      .attr('transform', 'rotate(-90)')
      .attr('text-anchor', 'middle')
      .style('font-size', '16px')
      .style('font-weight', 'bold')
      .text('Total Votes');

    // Y-axis
    const yAxis = svg.append('g').call(d3.axisLeft(y));

    const stackedData = d3
      .stack()
      .keys(['yes_count', 'no_count'])
      (voteData as any);

    const color = d3
      .scaleOrdinal()
      .domain(['yesVotes', 'noVotes'])
      .range(['#7fbf7b', '#af8dc3']);

    // Zoom behavior
    const xLinear = d3
      .scaleLinear()
      .domain([0, counties.length])
      .range([0, width]);

    function updateChart(event: any) {
      const t = event.transform;

      // Limit side-to-side movement
      t.x = Math.min(0, Math.max(t.x, -width * (t.k - 1)));
      t.y = 0;

      const newX = t.rescaleX(xLinear);

      // Determine visible counties
      const visibleCounties = counties.filter((county, i) => {
        const xPos = newX(i);
        return xPos >= 0 && xPos <= width;
      });

      // New Y domain based on visible data
      const visibleMax = d3.max(visibleCounties, (county) => {
        const countyData = voteData.find((d) => d.county_name === county);
        return countyData ? countyData.yes_count + countyData.no_count : 0;
      });

      // Fade axes/labels based on zoom
      if (t.k > 2.1) {
        xAxisLabel
          .transition()
          .duration(100)
          .style('opacity', 0);
        scatter
          .selectAll('text')
          .transition()
          .duration(100)
          .style('opacity', '1');
      } else {
        xAxisLabel
          .transition()
          .duration(100)
          .style('opacity', 1);
        scatter
          .selectAll('text')
          .transition()
          .duration(100)
          .style('opacity', '0');
      }

      // Update Y scale domain
      const newY = y.copy().domain([0, visibleMax || 1]);

      // Update Y-axis
      yAxis
        .transition()
        .duration(500)
        .ease(d3.easeCubicOut)
        .call(d3.axisLeft(newY));

      // Compute new bar width
      const barWidth = Math.min(newX(1) - newX(0), 40);

      // Update bars
      svg
        .selectAll('.bars rect')
        .transition()
        .duration(500)
        .ease(d3.easeCubicOut)
        .attr('x', (d: any) => newX(counties.indexOf(d.data.county_name)))
        .attr('width', barWidth)
        .attr('y', (d: any) => newY(d[1]))
        .attr('height', (d: any) => newY(d[0]) - newY(d[1]));

      // Move x-axis ticks
      svg
        .selectAll('.x-axis .tick')
        .transition()
        .duration(500)
        .ease(d3.easeCubicOut)
        .attr('transform', (d: any) =>
          'translate(' + (newX(counties.indexOf(d)) + barWidth * 0.5) + ',0)'
        );
    }

    const zoomBehavior = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([1, 30])
      .extent([[0, 0], [width, height]])
      .translateExtent([[0, 0], [width, height]])
      .on('zoom', (event) => updateChart(event));

    d3.select(svgRef.current).call(zoomBehavior);

    // Bars
    scatter
      .append('g')
      .attr('class', 'bars')
      .selectAll('g')
      .data(stackedData)
      .enter()
      .append('g')
      .attr('fill', (d: any) => color(d.key as string))
      .selectAll('rect')
      .data((d: any) => d)
      .enter()
      .append('rect')
      .attr('x', (d: any) => x(d.data.county_name)!)
      .attr('y', (d: any) => y(d[1]))
      .attr('height', (d: any) => y(d[0]) - y(d[1]))
      .attr('width', x.bandwidth())
      .attr('data-key', (d: any) => d.data.County)
      .style('stroke', '#000000')
      .on('mouseenter', function (event: MouseEvent, d: any) {
        const [mouseX, mouseY] = d3.pointer(event, document.body);
        d3.select(this).style('opacity', 0.7);
        const countyName = d.data.county_name;
        const yesVotes = d.data.yes_count;
        const noVotes = d.data.no_count;
        tooltip
          .style('opacity', 1)
          .html(
            `<div class="font-medium text-gray-900 mb-1">${countyName} County</div>
             <div class="text-gray-700">
             Votes For: ${yesVotes.toLocaleString()}<br/>
             Votes Against: ${noVotes.toLocaleString()}<br/>
             Total Votes: ${(yesVotes + noVotes).toLocaleString()}</div>`
          )
          .style('left', mouseX + 10 + 'px')
          .style('top', mouseY - 20 + 'px');
      })
      .on('mousemove', function (event: MouseEvent) {
        const [mouseX, mouseY] = d3.pointer(event, document.body);
        tooltip
          .style('left', mouseX + 10 + 'px')
          .style('top', mouseY - 20 + 'px');
      })
      .on('mouseleave', function () {
        d3.select(this).style('opacity', 1);
        tooltip.style('opacity', 0);
      });

    return () => {
      if (tooltipRef.current) {
        tooltipRef.current.remove();
      }
    };
  }, [voteData]);

  return (
    <div ref={containerRef} className="relative w-full h-full">
      <svg ref={svgRef} className="w-full h-full" />
    </div>
  );
}

