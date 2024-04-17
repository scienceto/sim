import React from 'react';
import LandingImage from './assets/landing-image.png'

const Home = () => {
  return (
    <div className='main-section-container'>
      <div className='content'>
      <h1 className='title'>Inventory Pro</h1>
      <p className='description'>
        Streamline your stock control with our intuitive Inventory Management System, designed to simplify order fulfillment and optimize supply chain efficiency
      </p>
      </div>
      <div className="image-container">
        <img src={LandingImage} alt="Inventory Management Visualization" className="image" />
      </div>
    </div>
    
  );
}

export default Home;