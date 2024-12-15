import prisma from '@/lib/prisma';
import { NextResponse, NextRequest } from 'next/server';

export async function GET(
  req: NextRequest, 
  { params }: { params: Promise<{ proposition_id: string }> }
) {
  try {
    // Correctly await the params
    const { proposition_id } = await params;

    if (!proposition_id) {
      console.error('No proposition_id provided');
      return NextResponse.json({ error: 'proposition_id parameter is required' }, { status: 400 });
    }

    const id = parseInt(proposition_id, 10);

    if (isNaN(id)) {
      console.error('Invalid proposition_id:', proposition_id);
      return NextResponse.json({ error: 'Invalid proposition_id' }, { status: 400 });
    }

    console.log('Fetching proposition with id:', id);

    const proposition = await prisma.propositions.findUnique({
      where: { id },
      include: {
        proposition_county_votes: {
          include: {
            counties: true,
          },
        },
      },
    });

    if (!proposition) {
      console.error('Proposition not found for id:', id);
      return NextResponse.json({ error: 'Proposition not found' }, { status: 404 });
    }

    const formattedVotes = proposition.proposition_county_votes.map((vote) => ({
      county_id: vote.county_id,
      county_name: vote.counties?.name || 'Unknown County',
      yes_count: vote.yes_count || 0,
      no_count: vote.no_count || 0,
      total_votes: vote.total_votes || 0,
    }));

    const responseData = {
      id: proposition.id,
      name: proposition.name,
      year: proposition.year,
      description: proposition.description,
      //for_statement: proposition.for_statement,
      //against_statement: proposition.against_statement,
      passed: proposition.passed,
      votes: formattedVotes,
    };

    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Error fetching proposition details:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch proposition details',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
