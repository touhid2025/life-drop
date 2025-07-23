import React from 'react';
import HomePage from '../component/HomePage';
import Loader from '../component/Loader';
import { useLoaderData } from 'react-router';

const Home = () => {
    const data = useLoaderData();
    console.log(data)
    return (
        <div className='min-h-screen'>
            
           
          
            <Loader/>
            <HomePage/>
        </div>
    );
};

export default Home;