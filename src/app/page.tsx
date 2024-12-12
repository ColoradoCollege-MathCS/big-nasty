'use client';
// skeleton page for a home screen
// TODO: make this the redirect page
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { HistImage } from '@/components/home/HistImage';
import { MapImage } from '@/components/home/MapImage';
import { PropImage } from '@/components/home/PropImage';
import Link from 'next/link';

export default function HomePage() {
    return (
      <div className="min-h-screen bg-white text-gray-900">
        <Header />
        <div className="pt-4 px-14">
          <h1 className="text-3xl font-serif">Colorado's Down-Ballot Data Visualizer</h1>
          <p className="text-sm">Explore the State of Colorado’s proposition and amendment races.</p>
          <hr className="h-px my-4 bg-violet-300 border-0"></hr>
        </div>
        <div className="min-h-content bg-white text-gray-900 px-14">
          <p className="text-m">Understanding how votes add up matters. It matters for big races, but it matters for smaller, down ballot races too.</p>
          <br></br>
          <p className="text-m"> The Colorado down ballot vote visualizer is another tool to be used in the pursuit of understanding down ballot voting trends in Colorado races. It’s hard to cover all of the propositions that come up in Colorado and it’s even harder to see trends around the state for similar propositions over the years. The three visualization tools this site offers are meant to lend a hand to journalists covering these races and to voters seeking more information about how support for state-level issues has changed over time. </p>
          <br></br>
          <p className="text-m">The County Level Pass/Fail Density Map allows users to search by year and proposition to see the density of support for a given proposition by county. The Proposition Comparison visualizer allows users to pick two separate years and two separate propositions within those years. This visualization aims to support users comparing two similar propositions on a county level to see how the level of support within counties has changed over time. The County Level Pass/Fail Histogram visualization allows users another way to think about county level support for propositions. </p> 
          <br></br>
          <p className="text-m"> These visualizations can be exported in their entirety and used in local election reporting. All the data for these visualizations comes from the Colorado Secretary of State’s elections data. Find out more about how this data was sourced <Link href="/about" className="text-m text-blue-700 hover:underline"> here</Link>.</p>

        </div>
        <div className="min-h-96 bg-white text-gray-900 py-4 px-14">
          <h1 className="text-xl">Explore Different Visualizations</h1>
            <div className="min-h-80 flex py-4 borderRadius items-stretch justify-between">
              <MapImage/>
              <PropImage/>
              <HistImage/>
            </div>
            <Footer/>
        </div>
      </div>
      

    );
};
