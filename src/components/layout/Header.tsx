import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Dropdown } from '../ui/Dropdown';

export const Header = () => {
  return (
    <header className="bg-violet-100 border-b shadow-md flex py-4">
      <div style={{width: '50%' }} className="items-left object-contain px-14">
          <Link href="/" className="text-3xl font-bold font-serif">
            Colorado Vote Visuals
          </Link>
          {/*<Image
              src="/The_Denver_Post.png"
              width={300}
              height={50}
              className="hidden md:block"
              alt="The Denver Post logo"
            />
          */}
        </div>
        <div style={{width: '50%' }} className="container mx-auto pr-14 pl-96 justify-between flex" id="navbar-default">
            <nav className="space-x-4">
                <Link href="/" className="text-xl hover:text-violet-950 hover:underline">Home</Link>
            </nav>
            <nav className="space-x-4">
                <Link href="/about" className="text-xl hover:text-violet-950 hover:underline">About</Link>
            </nav>
            <nav className="space-x-4">
              <Link href="" className="text-xl hover:text-violet-950">Options</Link>
              
            </nav>
          </div>
    </header>
  );
};