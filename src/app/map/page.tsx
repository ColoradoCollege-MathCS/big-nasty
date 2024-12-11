'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { ColoradoMap } from '@/components/map/D3Map';
import { LayerControl } from '@/components/controls/LayerControl';
import { PropositionFilters } from '@/components/filtering/PropositionFilters';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ResultDisplay } from '@/components/results/ResultDisplay';
import { Proposition, VoteData } from '@/types/propdata';

export default function Home() {
  const pathname = usePathname();
  const [selectedProp, setSelectedProp] = useState<Proposition | null>(null);
  const [voteData, setVoteData] = useState<VoteData[]>([]);
  const [totalYesVotes, setTotalYesVotes] = useState<number>(0);
  const [totalNoVotes, setTotalNoVotes] = useState<number>(0);

  const fetchVoteData = async (id: number) => {
    try {
      const response = await fetch(`/api/propositions/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch vote data');
      }
      const data = await response.json();
  
      if (Array.isArray(data.votes)) {
        setVoteData(data.votes); // Extract and set only the votes array
      } else {
        console.warn('API did not return a valid votes array:', data);
        setVoteData([]); // Default to an empty array
      }
    } catch (error) {
      console.error('Error fetching vote data:', error);
      setVoteData([]); // Handle errors by setting voteData to an empty array
    }
  };  
  
  // Calculate totals when voteData changes
  useEffect(() => {
    const sumVotes = () => {
      if (!Array.isArray(voteData)) return { totalYes: 0, totalNo: 0 };
  
      let totalYes = 0;
      let totalNo = 0;
  
      voteData.forEach((vote) => {
        totalYes += vote.yes_count;
        totalNo += vote.no_count;
      });
  
      return { totalYes, totalNo };
    };
  
    const totals = sumVotes();
    setTotalYesVotes(totals.totalYes);
    setTotalNoVotes(totals.totalNo);
  }, [voteData]);
  

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const propositionId = params.get('proposition_id'); // Retrieve the query string value
    if (propositionId) {
      const id = parseInt(propositionId, 10);

      // Set selectedProp state based on URL
      const prop = {
        id,
        name: `Congrats! You found an annoying bug. This is on Dan's TODO`, 
        year: 2020, 
        for_statement: '',
        against_statement: '',
      };
      setSelectedProp(prop);

      fetchVoteData(id); 
    }
  }, []);

  useEffect(() => {
    if (selectedProp) {
      const slug = `?proposition_id=${selectedProp.id}`;
      const newUrl = `/map/${slug}`;
      window.history.pushState({}, '', newUrl); 
    }
  }, [selectedProp]);

  // Calculate totals when voteData changes
  useEffect(() => {
    const sumVotes = () => {
      let totalYes = 0;
      let totalNo = 0;

      voteData.forEach((vote) => {
        totalYes += vote.yes_count;
        totalNo += vote.no_count;
      });

      return { totalYes, totalNo };
    };

    const totals = sumVotes();
    setTotalYesVotes(totals.totalYes);
    setTotalNoVotes(totals.totalNo);
  }, [voteData]);

const handleDropdownChange = (proposition: Proposition) => {
  setSelectedProp(proposition);
  fetchVoteData(proposition.id);

};

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-3">
            <Card className="h-[800px] flex flex-col grow">
              <div className="items-center justify-center flex">
                {selectedProp ? selectedProp.name : 'Select a Proposition'}
              </div>
              <ColoradoMap
                propositionId={selectedProp?.id || 0}
                year={selectedProp?.year || 0}
                voteData={voteData}
              />
            </Card>
          </div>
          <div className="space-y-4">
            <Card className="p-4">
              <PropositionFilters
                setSelectedProp={handleDropdownChange}
              />
            </Card>
            <Card>
              <ResultDisplay
                yesTotal={totalYesVotes}
                noTotal={totalNoVotes}
              />
            </Card>
            <Card>
              <LayerControl
                layers={[
                  { id: 'counties', label: 'Counties' },
                  { id: 'districts', label: 'Districts' },
                  { id: 'results', label: 'Election Results' },
                ]}
                activeLayers={['counties']}
                onToggleLayer={(id) => console.log('Toggle layer:', id)}
              />
            </Card>
            <Card>
              <div className="space-y-2">
                <Button variant="primary" className="w-full">
                  Export Map
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

