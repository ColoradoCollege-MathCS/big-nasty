import React from 'react';
import Link from 'next/link';

import '@/app/globals.css';

export const Dropdown = () => {
    const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(!open);
  };

  const handleMenuOne = () => {
    // do something
    setOpen(false);
  };

  const handleMenuTwo = () => {
    // do something
    setOpen(false);
  };

  return (
    <div>
      <button onClick={handleOpen}>Options</button>
      {open ? (
        <ul className="menu">
          <li className="menu-item">
            <button onClick={handleMenuOne}>Map</button>
          </li>
          <li className="menu-item">
            <button onClick={handleMenuTwo}>Histogram</button>
          </li>
        </ul>
      ) : null}
      {/*open ? <div>Is Open</div> : <div>Is Closed</div>*/}
    </div>
  );
};

