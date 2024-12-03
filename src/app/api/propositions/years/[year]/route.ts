import prisma from '@/lib/prisma'
import { NextResponse, NextRequest } from 'next/server'

/**
 * @fileoverview
 * This file contains the api call that returns all of the propositions
 * in a given voting year based on the given year value
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


export async function GET(req: NextRequest, {params}: {params: {year: string}}) {
  try {
    const { year }= await params

    // Check if 'year' is null or not a valid number
    if (!year) {
     return NextResponse.json({ error: 'Year query parameter is required' }, { status: 400 });
  }
    
    const propositions = await prisma.propositions.findMany({
      where:{
        year: parseInt(year, 10)
      },
      select: {
        id: true,
        name: true,
        year: true
      }
    })
    console.log(propositions)
    
    return NextResponse.json(propositions)
  } catch (error) {
    console.error('Prisma error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch propositions',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
}