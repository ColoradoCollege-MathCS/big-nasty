import React from 'react';
import Link from 'next/link';

export const Header = () => {
  return (
    <header className="bg-white border-b">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-xl font-bold">
            Big Nasty Colorado Elections
          </Link>
          <nav className="space-x-4">
            <Link href="/" className="hover:text-blue-600">Map</Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export const Home = () => {
  return (
    <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-xl font-bold">
              Down-Ballot Data Visualizer
            </Link>
            <nav className="space-x-4">
              <Link href="/" className="hover:text-blue-600">Map</Link>
            </nav>
          </div>
        </div>
      </header>
  );
};