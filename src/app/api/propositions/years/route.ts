import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'


/**
 * @fileoverview
 * This file contains the api call that returns all of the election years
 *
 * @dependencies
 * - prisma: ORM for database interaction.
 * - next.js: Framework used for server-side routing and API handling.
 *
 * @usage
 * - The `/propositions/years` endpoint retrieves all available years for propositions.
 * - The `/propositions/years/[year]` endpoint retrieves propositions for a specific year.
 * - The `/propositions/[proposition_id]` endpoint retrieves data for a given proposition ID.
 *
 * @author Oliver Ramirez, Dan Schmidt
 * @version 1.0.0
 * @date 2024-11-28
 * 
 */
export async function GET() {
  try {
    const results = await prisma.propositions.findMany({
      distinct: ['year'], //Get only the distinct years
      orderBy: {
        year: 'desc',  // Sort by year in descending order
      }
    })
   
    const years = results.map(result => result.year)
    
    return NextResponse.json(years)
  } catch (error) {
    console.error('Prisma error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch years for proposition',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
}