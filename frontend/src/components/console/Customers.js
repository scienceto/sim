import { useState, useEffect } from "react";
import { apiBaseUrl } from "../../config";

const Customer = () => {
  const [customers, setCustomers] = useState([]);
  const [formData, setFormData] = useState({
    app_user: "",
    status: ""
  });

  const fetchCustomers = async () => {
    try {
      const response = await fetch(`${apiBaseUrl}/cusotmers`);
      if (!response.ok) {
        throw new Error("Failed to fetch customers");
      }
      const data = await response.json();
      setCustomers(data);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

    return (
      <div className="product-container">
      <div className="product-table">
        <h2>Customers</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Address</th>
              <th>Metadata</th>
              {/* Add more table headers as needed */}
            </tr>
          </thead>
          {/* <tbody>
            {suppliers.map((product) => (
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
        <h2>Add Customers</h2>
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
          <button type="submit">Add Customers</button>
        </form>
      </div> */}
    </div>
    );
  };
  
  export default Customer;
  