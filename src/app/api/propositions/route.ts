import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

/**
 * @fileoverview
 * This file contains the API call that returns data for a given proposition ID.
 *
 * @usage
 * - The `/propositions/[proposition_id]` endpoint retrieves data for a specific proposition ID.
 *
 * @author Oliver Ramirez, Dan Schmidt
 * @version 1.0.0
 * @date 2024-11-28
 */

export async function GET(
  req: Request,
  { params }: { params: Promise<{ proposition_id: string }> }
) {

  try {
      const { proposition_id } = await params;


    // Validate proposition_id
    if (!proposition_id || isNaN(Number(proposition_id))) {
      return NextResponse.json(
        { error: 'proposition_id parameter is required and must be a valid number' },
        { status: 400 }
      );
    }

    const prop_data = await prisma.proposition_county_votes.findMany({
      where: {
        proposition_id: parseInt(proposition_id, 10),
      },
      select: {
        county_id: true,
        yes_count: true,
        no_count: true,
        total_votes: true,
        counties: {
          select: {
            name: true,
          },
        },
      },
    });

    const packedData = prop_data.map((item) => ({
      county_id: item.county_id,
      yes_count: item.yes_count,
      no_count: item.no_count,
      total_votes: item.total_votes,
      county_name: item.counties.name,
    }));

    return NextResponse.json(packedData);
  } catch (error) {
    console.error('Prisma error:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch proposition data',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}