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
      const countyData = voteData.find(d => d.county_name === county_name);
      if (!countyData) return { votesFor: 0, votesAgainst: 0, turnout: 0 };
      return {
        votesFor: countyData.yes_count,
        votesAgainst: countyData.no_count,
        turnout: countyData.total_votes
      };
    }


    function getColor(county_name: string) {
      const colorScale = setupcolor();
      //const colorScale2 = setupcolor2();
      const { votesFor, votesAgainst } = getVotes(county_name);
      if (votesFor === 0 && votesAgainst === 0){
        return '#ccc';
      } 
      const percent_yes = (votesFor/(votesFor+votesAgainst)*100);
      //console.log("colorscale1: "+colorScale(percent_yes));
      //console.log("colorscale2: "+colorScale2(percent_yes));
      return colorScale(percent_yes);
    }

    function county_passed(county_name: string) {
      const { votesFor, votesAgainst } = getVotes(county_name);
      if (votesFor === 0 && votesAgainst === 0) {
        return false;
      }
      if (votesFor > (.5*(votesFor+votesAgainst))) {
        return true;
      }
      return false;
    }
    
    
    function setupcolor() {
      const colorScale = d3
        .scaleLinear<number, number>() // Domain and range should match the interpolation type
        .domain([0, 25, 50,75, 100]) // Map percentages to color stops
        .range([0, 1, 2, 3,4]) 
        .interpolate(() =>
          d3.interpolateRgbBasis(['#edf8fb',
        '#b3cde3',
        '#8c96c6',
        '#8856a7',
        '#810f7c',])
        );
      return (value: number) => colorScale(value);
    }
    

    // function setupcolor() {
    //   const colorScale = d3
    //     .scaleLinear()
    //     .domain([0, 25, 50, 75, 100]) // Map percentages to color stops
    //     .range([
    //       '#edf8fb',
    //       '#b3cde3',
    //       '#8c96c6',
    //       '#8856a7',
    //       '#810f7c',
    //     ]); // Your hues
    //   return colorScale;
    // }


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

        //hashing code
        svg
        .append('defs')
        .append('pattern')
        .attr('id', 'diagonalHatch')
        .attr('patternUnits', 'userSpaceOnUse')
        .attr('width', 9) // Increase spacing
        .attr('height', 9) // Increase spacing
        .append('path')
        .attr('d', 'M0,9 l9,-9 M-9,9 l9,-9 M9,9 l9,-9') // Adjust path for wider spacing
        .attr('stroke', '#000000')
        .attr('stroke-width', 1.5);

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
    .attr('stroke-width', .4);

      // Add counties
      svg.append('g')
        .selectAll('path')
        .data(us.features)
        .join('path')
        .attr('fill', (d) => {
          const passed = county_passed(d.properties.name);
          if (passed == true) {
            return getColor(d.properties.name);
          }
          return '#ccc';
        })
        .attr('d', path)
        .attr('stroke', '#333')
        .attr('stroke-width', 0.5)

        //hashing
        svg
        .append('g')
        .attr('class', 'counties')
        .selectAll('path')
        .data(us.features)
        .enter()
        .append('path')
        .attr('fill', (d) => {
          const passed = county_passed(d.properties.name);
          if (passed == true) {
            return 'url(#diagonalHatch)';
          }
          return getColor(d.properties.name);
        })
        .attr('d', path)
        .attr('stroke', '#333')
        .attr('stroke-width', 0.5)
        .on('mouseenter', function(event, d: Feature<Geometry, CountyProperties>) {
          const passed = county_passed(d.properties.name);
          const votes = getVotes(d.properties.name);
          d3.select(this).style('opacity', 0.5);
          d3.select(this).attr('fill', passed ? 'url(#diagonalHatch_hover)' : getColor(d.properties.name));
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
        .on('mouseleave',function(event, d: Feature<Geometry, CountyProperties>) {
          const passed = county_passed(d.properties.name);
          d3.select(this).style('opacity', 1);
          d3.select(this).attr('fill', passed ? 'url(#diagonalHatch)' : getColor(d.properties.name));
          tooltip.style('opacity', 0);
        });
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
  }, [voteData]); 
  
  return (
    <div 
      ref={containerRef} 
      className="relative w-full h-full"
    >
      <svg 
        ref={svgRef}
        id="map-svg"
        className="w-full h-full"
      />
    </div>
  );
}
