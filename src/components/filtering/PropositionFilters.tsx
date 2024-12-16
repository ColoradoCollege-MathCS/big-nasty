'use client';

import React, { useEffect, useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {Proposition} from '@/types/propdata';
import { useRouter } from 'next/navigation'; 


interface Props {
  setSelectedProp: (value: Proposition) => void; // Accept a string and return nothing
}

export function PropositionFilters(props: Props) {

  const [propositions, setPropositions] = useState<Proposition[]>([])
  const [selectedProposition, setSelectedProposition] = useState<Proposition>({ id: 0, name: '', year: 0, votes : [], description : ''})

  const [availableYears, setAvailableYears] = useState<number[]>([])
  const [selectedYear, setSelectedYear] = useState<string>('')

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const router = useRouter()

  //console.log("in propositionFilters.tsx, setSelectedProp is", props.setSelectedProp)

  
  useEffect(() => {
    //Fetch voting years for the drop down on mounting of the component
    const fetchYears = async () => {
        try {
          const response = await fetch(`/api/propositions/years`)
          if (!response.ok) {
            throw new Error('Failed to fetch Years')
            return
          }
          const years = await response.json()
          setAvailableYears(years)
        }
         catch {
          console.log("failure")
          setAvailableYears([])
        } finally {
          setLoading(false)
        }
      }
      const fetchPropositionByID = async(prop_id:string) =>{
        try {
          const response = await fetch(`/api/propositions/${prop_id}`)
          if (!response.ok) {
            throw new Error('Failed to fetch proposition')
            return
          }
          const prop = await response.json()
          console.log("fetched the propsoitionByID", prop)
          setSelectedYear(String(prop.year))
          setSelectedProposition(prop)
          props.setSelectedProp(prop);
          
        }
         catch {
          console.log("failure")
          return null
        } finally {
          setLoading(false)
        }

      }
      //populate years on component mount
      fetchYears()

      //if the url contains a value for parameter_id, populate the values from the given prop ID
      const searchParams = new URLSearchParams(window.location.search);
      const urlPropId = searchParams.get('proposition_id')
      if (urlPropId){
        fetchPropositionByID(urlPropId)
      }
  }, [])

  //Fetch propositions from the selected year when a year is chose.
  useEffect(() => {
    const fetchPropositions = async () => {
      try {
        //console.log("calling fetchPropositions with year value: ", selectedYear)
        const response = await fetch(`/api/propositions/years/${selectedYear}`)
        console.log("the response is", response)
        if (!response.ok){
          throw new Error('failed to fetch propositions')
        }
        const props = await response.json()
        
        console.log("setting propositions to ", props )
        setPropositions(props)
      }catch{
        setPropositions([])
      }
      
    }
    
    if (!selectedYear) return

    fetchPropositions()
    
  }, [selectedYear])

  //handle passing the selected prop to the parent container
  const handlePropositionChange = (value:string) => {
    const selected = propositions.find((prop) => prop.name === value);

    if (selected) {
      setSelectedProposition(selected);
      props.setSelectedProp(selected);
    } else {
      throw new Error('failed to map prop name to proposition object')
      setSelectedProposition({id:0, name:'', year: 0, votes: [], description : ''});  
  };
}
  


  if (loading) return <div className="text-gray-500">Loading propositions...</div>
  if (error) return <div className="text-red-500">Error: {error}</div>

  return (
    <div className="space-y-4">

      {/*Year Drop Down Menu Selector*/}
      <Select 
        onValueChange={setSelectedYear} 
        value={selectedYear}
      >
        <SelectTrigger className="w-full text-gray-900">
          <SelectValue placeholder="Select year" className="text-gray-900" />
        </SelectTrigger>
        <SelectContent className="text-gray-900">
          {availableYears.length > 0 ? (
            availableYears.map((year) => (
              <SelectItem key={year} value={year.toString()}>
                {year}
              </SelectItem>
            ))
          ) : (
            <SelectItem value="no-years-available" disabled>
              {/*selectedProposition ? 'No years available' : 'Select a proposition first'*/}
            </SelectItem>
          )}
        </SelectContent>
      </Select>

      {/*Proposition Drop Down Menu Selector*/}
      <Select
      onValueChange={handlePropositionChange}
       value={selectedProposition.name}
       disabled={!selectedYear}
        >
        <SelectTrigger className="w-full text-gray-900">
          <SelectValue placeholder="Select a proposition" className="text-gray-900" />
        </SelectTrigger>
        <SelectContent className="text-gray-900">
          {propositions.length > 0 ? (
            //console.log("propositions", propositions),
            propositions.map((prop) => {
              return (
                <SelectItem key={prop.id} value={prop.name}>
                  {prop.name}
                </SelectItem>
              )
            })
          ) : (
            <SelectItem value="no-propositions-available" disabled>
              No propositions available
            </SelectItem>
          )}
        </SelectContent>
      </Select>
    </div>
  )
}

