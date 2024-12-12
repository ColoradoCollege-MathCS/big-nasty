'use client';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { DividerVerticalIcon } from '@radix-ui/react-icons';
import { useState } from 'react';
{/*import emailjs from '@emailjs/browser'; */}

{/*
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [stateMessage, setStateMessage] = useState(null);
    const sendEmail = (e) => {
        e.persist();
        e.preventDefault();
        setIsSubmitting(true);
        emailjs
        .sendForm(
            {/* fill out with emailjs keys
            process.env.REACT_APP_SERVICE_ID,
            process.env.REACT_APP_TEMPLATE_ID,
            e.target,
            process.env.REACT_APP_PUBLIC_KEY
        )
        .then(
            (result) => {
            setStateMessage('Message sent!');
            setIsSubmitting(false);
            setTimeout(() => {
                setStateMessage(null);
            }, 5000); // hide message after 5 seconds
            },
            (error) => {
            setStateMessage('Something went wrong, please try again later');
            setIsSubmitting(false);
            setTimeout(() => {
                setStateMessage(null);
            }, 5000); // hide message after 5 seconds
            }
        );
        
        // Clears the form after sending the email
        e.target.reset();
    }; */}

export default function Contact() {

    return (
        <div className="min-h-screen bg-white text-gray-900">
            <Header/>

        <main className='h-screen flex items-center justify-center'>
            <form className="bg-violet-100 flex rounded-lg w-1/2" > {/*onSubmit={sendEmail} */}
                <div className='flex-1 p-20 items-center justify-center'>
                    <h1 className='text-2xl pb-2 text-gray-900'>
                        Questions? Comments? Concerns?
                    </h1>
                    <p className='text-lg text-gray-700'>
                        Reach out to the creators.
                    </p>
                    <div className='flex justify-between'>
                        <div className='mt-6'>
                            {/*Name input field*/}
                            <div className='pb-4'>
                                <label htmlFor='name' className='block text-med pb-2'>Name</label>
                                <input 
                                    className='border-2 border-gray-500 p-2 rounded-md focus:border-violet-500focus:ring-violet-500' 
                                    type='text' 
                                    name='name' 
                                    placeholder='Enter your name'/>
                            </div>
                            {/*Email input field*/}
                            <div className='pb-4'>
                                <label htmlFor='email' className='block text-med pb-2'>Email</label>
                                <input 
                                    className='border-2 border-gray-500 p-2 rounded-md focus:border-violet-500 focus:ring-violet-500' 
                                    type='email' 
                                    name='email' 
                                    placeholder='name@email.com'/>
                            </div>
                            
                        </div>
                        {/*Message input field*/}
                        <div className='mt-6'>
                            <div className='pb-4'>
                                <label htmlFor='message' className='block text-med pb-2'>Message</label>
                                <input 
                                    className='border-2 border-gray-500 p-2 rounded-md focus:border-violet-500 focus:ring-violet-500' 
                                    type='text' 
                                    name='message' 
                                    placeholder='Enter your message'/>
                                <input type="submit" value="Send" className='block text-med pb-2' /> {/*disabled={isSubmitting} */}
                                {/*{stateMessage && <p>{stateMessage}</p>}*/}
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </main>
        <div className='px-14'>
            <Footer/>
        </div>
            
        </div>
    )
}
