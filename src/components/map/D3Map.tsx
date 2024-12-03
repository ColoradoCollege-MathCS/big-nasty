'use client';

import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Feature, FeatureCollection, Geometry } from 'geojson';
import {VoteData} from '@/types/propdata';


type MapProps = {
  propositionId?: number;
  year?: number;
  voteData?: VoteData[];
}

type CountyProperties = {
  name: string;
  [key: string]: any;
}

export function ColoradoMap({ propositionId, year: year, voteData = [] }: MapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<d3.Selection<HTMLDivElement, unknown, HTMLElement, any>>();

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

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

    function getVotes(county_name: string) {
      console.log("county name is " ,county_name)
      const countyData = voteData.find(d => d.county_name === county_name);
      if (!countyData) return { votesFor: 0, votesAgainst: 0, turnout: 0 };
      return {
        votesFor: countyData.yes_count,
        votesAgainst: countyData.no_count,
        turnout: countyData.total_votes
      };
    }

    function getColor(county_name: string) {
      const { votesFor, votesAgainst } = getVotes(county_name);
      if (votesFor === 0 && votesAgainst === 0) return '#ccc';
      return votesFor > votesAgainst ? '#1a9850' : '#d73027';
    }

    function render(us: FeatureCollection<Geometry, CountyProperties>) {
      const width = containerRef.current?.clientWidth || 800;
      const height = containerRef.current?.clientHeight || 800;

      // Set up SVG
      const svg = d3.select(svgRef.current)
        .attr('width', width)
        .attr('height', height);

      // Clear previous content
      svg.selectAll('*').remove();

      // Set up projection
      const projection = d3.geoMercator()
        .fitSize([width, height], us);

      const path = d3.geoPath().projection(projection);

      // Add counties
      svg.append('g')
        .selectAll('path')
        .data(us.features)
        .join('path')
        .attr('fill', d => getColor(d.properties.name))
        .attr('d', path)
        .attr('stroke', '#333')
        .attr('stroke-width', 0.5)
        .on('mouseenter', function(event, d: Feature<Geometry, CountyProperties>) {
          const votes = getVotes(d.properties.name);
          console.log(d, votes)
          d3.select(this).style('opacity', 0.8);
          tooltip
            .style('opacity', 1)
            .html(
              `<div class="font-medium text-gray-900 mb-1">${d.properties.name} County</div>
                <div class="text-gray-700">
               Votes For: ${votes.votesFor.toLocaleString()}<br/>
               Votes Against: ${votes.votesAgainst.toLocaleString()}<br/>
               Turnout: ${votes.turnout.toLocaleString()}`
            )
            .style('left', (event.pageX + 10) + 'px')
            .style('top', (event.pageY - 20) + 'px');
        })
        .on('mousemove', function(event) {
          tooltip
            .style('left', (event.pageX + 10) + 'px')
            .style('top', (event.pageY - 20) + 'px');
        })
        .on('mouseleave', function() {
          d3.select(this).style('opacity', 1);
          tooltip.style('opacity', 0);
        });

      // Add labels
    //   svg.append('g')
    //     .selectAll('text')
    //     .data(us.features)
    //     .join('text')
    //     .attr('transform', d => `translate(${path.centroid(d)})`)
    //     .attr('dy', '.35em')
    //     .text(d => d.properties.name)
    //     .attr('font-size', '8px')
    //     .attr('text-anchor', 'middle')
    //     .attr('pointer-events', 'none')
    //     .attr('fill', '#000');
    }

    // Fetch GeoJSON data
    fetch('https://raw.githubusercontent.com/earthlab/earthpy/refs/heads/main/earthpy/example-data/colorado-counties.geojson')
      .then(response => response.json())
      .then((countyData: FeatureCollection<Geometry, CountyProperties>) => {
        render(countyData);

        // Handle window resize
        const handleResize = () => {
          if (containerRef.current) {
            render(countyData);
          }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
      })
      .catch(error => {
        console.error('Error loading county data:', error);
      });

    return () => {
      if (tooltipRef.current) {
        tooltipRef.current.remove();
      }
    };
  }, [voteData]); // Added voteData to dependencies

  return (
    <div 
      ref={containerRef} 
      className="relative w-full h-full"
    >
      <svg 
        ref={svgRef}
        className="w-full h-full"
      />
    </div>
  );
}