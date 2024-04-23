import { useState, useEffect } from "react";
import { apiBaseUrl } from "../../config";

const Inventory = () => {
  const [inventory, setInventory] = useState([]);

  const fetchInventory = async () => {
    try {
      const idToken = localStorage.getItem('idToken');
      console.log("ID token:", idToken);
      const response = await fetch(`${apiBaseUrl}/inventory`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${idToken}`
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch inventory");
      }
      const data = await response.json();
      setInventory(data);
      console.log("Inventory:", data);
    } catch (error) {
      console.error("Error fetching inventory:", error);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  return (
    <div className="product-container">
      <div className="product-table">
        <h2>Inventory</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Product</th>
              <th>Quantity</th>
              <th>Warehouse</th>
              {/* Add more table headers as needed */}
            </tr>
          </thead>
          <tbody>
            {inventory.map((data) => (
              <tr key={data.id}>
                <td>{data.id}</td>
                <td>{data.product}</td>
                <td>{data.quantity}</td>
                <td>{data.warehouse}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Inventory;
