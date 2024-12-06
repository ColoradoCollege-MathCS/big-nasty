'use client';


import React, { useState, useEffect } from 'react'
import { Header } from '@/components/layout/Header';
import { ColoradoMap } from '@/components/map/D3Map';
import { LayerControl } from '@/components/controls/LayerControl';
import { PropositionFilters } from '@/components/filtering/PropositionFilters';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ResultDisplay } from '@/components/results/ResultDisplay';
import {Proposition, VoteData} from '@/types/propdata';
import ProgressDemo from '@/components/ui/Progress';



export default function Home() {
  const [selectedProp, setSelectedProp] = useState<Proposition>({id:0, name:'', year: 0, for_statement:" ", against_statement: " "})
  const [voteData, setVoteData] = useState<VoteData[]>([])
  const [totalYesVotes, setTotalYesVotes] = useState<number>(0)
  const [totalNoVotes, setTotalNoVotes] = useState<number>(0)
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
  
  //when the selected prop is updated, update vote data
  useEffect(() => {
    
    console.log("selectedProp in page.tsx is: ", selectedProp)
    fetchVoteData()
  }, [selectedProp])

  useEffect(() =>{
    function sumVotes (){
      let totalYes = 0
      let totalNo = 0

      voteData.forEach(voteData => {
        totalYes += voteData.yes_count
        totalNo += voteData.no_count
      })

      return {totalYes, totalNo}
    }

    const totals = sumVotes()
    console.log("totals: ", totals)
    setTotalYesVotes(totals.totalYes)
    setTotalNoVotes(totals.totalNo)
  },[voteData])


  return (
    
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-3">
            <Card className="h-[800px] flex flex-col grow">
              <div className="items-center justify-center flex">
              {selectedProp.name}
              </div>
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
              <ResultDisplay yesTotal={totalYesVotes} noTotal={totalNoVotes}/>
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


