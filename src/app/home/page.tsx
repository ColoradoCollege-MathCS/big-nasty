'use client';
// skeleton page for a home screen
// TODO: make this the redirect page
// TODO: link to the page with the choropleth map
import { Header } from '@/components/layout/Header';
import { HistImage } from './HistImage';
import { MapImage } from './MapImage';

export default function HomePage() {
    return (
      <div className="min-h-screen bg-white text-gray-900">
        <Header />
        <div className="py-4 px-14">
          <h1 className="text-3xl font-serif">Colorado's Down-Ballot Data Visualizer</h1>
          <p className="text-sm">Explore the State of Colorado’s proposition and amendment races.</p>
          <hr className="h-px my-4 bg-violet-300 border-0"></hr>
        </div>
        <div className="min-h-content bg-white text-gray-900 px-14">
          <p className="text-m"> This is sample of text that will go here explaining this website. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus aliquam porttitor justo sit amet ornare. Curabitur consequat faucibus suscipit. Aliquam sed eros lacinia, porttitor metus vel, ultrices tellus. Aenean finibus lacus dui, sit amet dapibus nisl volutpat ac. Mauris et velit sapien. Cras urna ligula, auctor eu mi eu, molestie facilisis enim. Suspendisse efficitur leo eros. Aenean tristique vitae leo ut sollicitudin. Etiam tempor ultricies lectus quis posuere. Duis mollis dui ipsum, eget tempor nibh maximus at.

Integer blandit eleifend dolor, at vulputate urna molestie quis. Nullam sit amet lacus sit amet augue ultricies porttitor tristique et purus. Integer rutrum.</p>

        </div>
        <div className="min-h-96 bg-white text-gray-900 px-14 py-4">
          <h1 className="text-xl">Explore Different Visualizations</h1>
            <div className="min-h-96 flex justify-between py-4 px-14 borderRadius">
              <MapImage/>
              <HistImage/>
            </div>
        </div>
    
      </div>

    );
};
