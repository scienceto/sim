import { useState, useEffect } from "react";
import { apiBaseUrl } from "../../config";

const Supplier = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [formData, setFormData] = useState({
    app_user: "",
    status: ""
  });

  const fetchSuppliers = async () => {
    try {
      const response = await fetch(`${apiBaseUrl}/suppliers`);
      if (!response.ok) {
        throw new Error("Failed to fetch suppliers");
      }
      const data = await response.json();
      setSuppliers(data);
    } catch (error) {
      console.error("Error fetching suppliers:", error);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

    return (
      <div className="product-container">
      <div className="product-table">
        <h2>Suppliers</h2>
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
        <h2>Add Suppliers</h2>
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
          <button type="submit">Add Suppliers</button>
        </form>
      </div> */}
    </div>
    );
  };
  
  export default Warehouse;
  