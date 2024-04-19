import 'react-tabs/style/react-tabs.css';
import LandingImage from './assets/landing-image.png';
import './App.css';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate= useNavigate();

  return (
    <>
      <div className='main-section-container'>
      <div className='content'>
        <h1 className='title'>Inventory Pro</h1>
        <p className='description'>
          Streamline your stock control with our intuitive Inventory Management System, designed to simplify order fulfillment and optimize supply chain efficiency
        </p>
        <button className='get-started-btn' onClick={() => navigate('/console')}>
    Get Started!
  </button>
      </div>
      <div className="image-container">
        <img src={LandingImage} alt="Inventory Management Visualization" className="image" />
      </div>
    </div>
    </>
  );
}

export default Home;
