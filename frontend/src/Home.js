import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import Inventory from './components/console/Inventory';
import Product from './components/console/Product';
import Supplier from './components/console/Supplier';
import Warehouse from './components/console/Warehouse';
import Purchase from './components/console/Purchase';
import Sale from './components/console/Sale';
// import LandingImage from './assets/landing-image.png';
import './App.css';

const Home = () => {
  return (
    <div className='main-section-container'>
      {/* <div className='content'>
        <h1 className='title'>Inventory Pro</h1>
        <p className='description'>
          Streamline your stock control with our intuitive Inventory Management System, designed to simplify order fulfillment and optimize supply chain efficiency
        </p>
      </div> */}
      <div className="tabs-container">
        <Tabs>
          <TabList>
            <Tab>Products</Tab>
            <Tab>Inventory</Tab>
            <Tab>Warehouses</Tab>
            <Tab>Suppliers</Tab>
            <Tab>Purchases</Tab>
            <Tab>Sales</Tab>
          </TabList>

          <TabPanel>
            <Product />
          </TabPanel>
          <TabPanel>
            <Inventory />
          </TabPanel>
          <TabPanel>
            <Warehouse />
          </TabPanel>
          <TabPanel>
            <Supplier />
          </TabPanel>
          <TabPanel>
            <Purchase />
          </TabPanel>
          <TabPanel>
            <Sale />
          </TabPanel>
        </Tabs>
      </div>
      {/* <div className="image-container">
        <img src={LandingImage} alt="Inventory Management Visualization" className="image" />
      </div> */}
    </div>
  );
}

export default Home;
