'use client';


import React, { useState, useEffect } from 'react'
import { Header } from '@/components/layout/Header';
import { ColoradoMap } from '@/components/map/D3Map';
import { LayerControl } from '@/components/controls/LayerControl';
import { PropositionFilters } from '@/components/filtering/PropositionFilters';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {Proposition, VoteData} from '@/types/propdata';

//example api call for fetching voter data stored at bottom of file




export default function Home() {
  const [selectedProp, setSelectedProp] = useState<Proposition>({id:0, name:'', year: 0})
  const [voteData, setVoteData] = useState<VoteData[]>([])
  //console.log("in page.tsx, setSelectedProp is", setSelectedProp)

  const fetchVoteData = async () => {
    try {
      const response = await fetch(`api/propositions/${selectedProp.id}`)
      console.log(response)
      if (!response.ok){
        throw new Error('failed to fetch data')
      }
      const data : VoteData[] = await response.json()

      console.log("the data fectched is ", data)
      setVoteData(data)
    }catch{
    }
  }
  //fetchVoteData()

  useEffect(() => {
    console.log("Updated voteData:", voteData);
  }, [voteData]);
  
  useEffect(() => {
    console.log("selectedProp in page.tsx is: ", selectedProp)
    fetchVoteData()
    //console.log("voteData is: ", voteData)

  }, [selectedProp])

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-3">
            <Card className="h-[800px]">
              <ColoradoMap 
                propositionId={selectedProp.id}
                year = {selectedProp.year}
                voteData = {voteData}   />
            </Card>
          </div>
          
          <div className="space-y-4">
            <Card className="p-4">
              <PropositionFilters setSelectedProp={setSelectedProp}/>
            </Card>
            
            <Card>
              <LayerControl 
                layers={[
                  { id: 'counties', label: 'Counties' },
                  { id: 'districts', label: 'Districts' },
                  { id: 'results', label: 'Election Results' }
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


