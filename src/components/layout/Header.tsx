import React from 'react';
import Link from 'next/link';

export const Header = () => {
  return (
    <header className="bg-violet-100 border-b shadow-md">
      <div className="container mx-auto px-4 py-3" id="navbar-default">
        <div className="flex items-center justify-between p-4">
          <Link href="/" className="text-3xl font-bold font-serif">
            Down-Ballot Data Visualizer
          </Link>
          <nav className="space-x-4">
              <Link href="/dashboard" className="text-xl hover:text-violet-950">Home</Link>
          </nav>
          <nav className="space-x-4">
              <Link href="/about" className="text-xl hover:text-violet-950">About</Link>
          </nav>
          <nav className="space-x-4">
            <Link href="" className="text-xl hover:text-violet-950 ">Options</Link>
          </nav>
        </div>
      </div>
    </header>
  );
};