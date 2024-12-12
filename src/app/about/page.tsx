"use client"

import { Header } from '@/components/layout/Header';

export default function AboutPage() {
    return (
    <div className="min-h-screen bg-white text-gray-900">
        <Header />
        <div className="py-4 px-14 ">
          <h1 className="text-3xl font-serif">About This Crazy Project</h1>
          <p className="text-sm">Who is this for and why was it created?</p>
          <hr className="h-px my-4 bg-violet-300 border-0"></hr>
        </div>
      </div>

    );
};