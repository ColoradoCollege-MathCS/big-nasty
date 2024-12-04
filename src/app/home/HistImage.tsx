import React from 'react';
import Link from 'next/link';

export const HistImage = () => {
    return (
        <div className="bg-violet-100 border-b shadow-md py-4 px-14" style={{ borderBottomRightRadius: 10, borderBottomLeftRadius: 10, borderTopLeftRadius: 10, borderTopRightRadius: 10}}> {/* Convoluted but will go into style later */}
            <Link href="" className="text-3xl font-bold font-serif hover:underline">
            State-Wide Histogram
          </Link>


        </div>
    );
};
