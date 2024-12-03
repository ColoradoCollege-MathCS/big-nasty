'use client';
// skeleton page for a home screen
// TODO: make this the redirect page
// TODO: link to the page with the choropleth map
import { Header } from '@/components/layout/Header';

export default function HomePage() {
    return (
      <div className="min-h-screen bg-white text-gray-900">
        <Header />
        <div className="py-4 px-14">
          <h1 className="text-3xl font-serif">Colorado's Down-Ballot Data Visualizer</h1>
          <p className="text-sm">Explore the State of Colorado’s proposition and amendment races.</p>
          <hr className="h-px my-4 bg-violet-300 border-0"></hr>
        </div>
      </div>

    );
};
