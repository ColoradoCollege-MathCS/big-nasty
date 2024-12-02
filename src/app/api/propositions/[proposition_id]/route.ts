import prisma from '@/lib/prisma'
import { NextResponse, NextRequest } from 'next/server'

/**
 * @fileoverview
 * This file contains the api call that will return the data from a 
 * given proposition id.
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


export async function GET(req: NextRequest, {params}: {params: {proposition_id: string}}) {
  try {
    const { proposition_id }= await params

    // Check if 'year' is null or not a valid number
    if (!proposition_id) {
     return NextResponse.json({ error: 'proposition_id parameter is required' }, { status: 400 });
  }
    
    const prop_data = await prisma.proposition_county_votes.findMany({
      where: {
        proposition_id: parseInt(proposition_id, 10)
      }
    })
    
    
    return NextResponse.json(prop_data)
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