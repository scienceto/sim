import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import Inventory from './console/Inventory';
import Product from './console/Product';
import Supplier from './console/Supplier';
import Warehouse from './console/Warehouse';
import Purchase from './console/Purchase';
import Sale from './console/Sale';
import '../App.css';

const Console = () => {
    return (
        <>
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
        </>
    );
};

export default Console;