import { useState, useEffect } from "react";
import { apiBaseUrl } from "../../config";

const Warehouse = () => {
  const [warehouses, setWarehouses] = useState([]);
  const [formData, setFormData] = useState({
    app_user: "",
    status: ""
  });

  const fetchWarehouses = async () => {
    try {
      const response = await fetch(`${apiBaseUrl}/warehouses`);
      if (!response.ok) {
        throw new Error("Failed to fetch warehouses");
      }
      const data = await response.json();
      setWarehouses(data);
    } catch (error) {
      console.error("Error fetching warehouses:", error);
    }
  };

  useEffect(() => {
    fetchWarehouses();
  }, []);

    return (
      <div className="product-container">
      <div className="product-table">
        <h2>Purchases</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Address</th>
              {/* Add more table headers as needed */}
            </tr>
          </thead>
          {/* <tbody>
            {warehouse.map((product) => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>{product.name}</td>
                <td>{product.category}</td>
                <td>{product.description}</td>
              </tr>
            ))}
          </tbody> */}
        </table>
      </div>
      {/* <div className="product-form">
        <h2>Add Warehouse</h2>
        <form>
          <div>
            <label>:</label>
            <input type="text" name="name" value={formData.name} />
          </div>
          <div>
            <label>Category:</label>
            <input type="text" name="category" value={formData.category} />
          </div>
          <div>
            <label>Description:</label>
            <textarea name="description" value={formData.description}  />
          </div>
          <button type="submit">Add Warehouse</button>
        </form>
      </div> */}
    </div>
    );
  };
  
  export default Warehouse;
  