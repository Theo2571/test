import React from 'react';
import NewsList from "../components/NewList/NewList";
import "./HomePage.css"
const HomePage = () => {
    return (
        <div className='wrapper'>
            <h1 style={{textAlign:"center"}}>Hacker News</h1>
            <NewsList />
        </div>
    );
};

export default HomePage;