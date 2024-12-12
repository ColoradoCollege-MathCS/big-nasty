import React from 'react';

function GradientBar() {
    return (
        <div>
            <p className='mx-14 mt-2 text-lg flex justify-center'>Percent Support</p>
                <div className='flex-col'>
                    <div className='items-center flex mb-2 mx-2 border-2 border-gray-500' style={{
                        width: '100%',
                        height: '20px',
                        background: 'linear-gradient(to right, #edf8fb, #b3cde3, #8c96c6, #8856a7, #810f7c)' 
                    }}>
                    </div>
                    <div className='flex items-stretch justify-between mb-4'>
                        <p>0%</p>
                        <p>25%</p>
                        <p>50%</p>
                        <p>75%</p>
                        <p>100%</p>
                    </div>   
            </div>
        </div>

    );
  }
  
  export default GradientBar;
