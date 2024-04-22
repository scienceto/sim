import { useState, useEffect } from "react";
import { apiBaseUrl } from "../../config";

const Purchase = () => {
  const [purchases, setPurchases] = useState([]);
  const [formData, setFormData] = useState({
    supplier: "",
    app_user: "",
    status: ""
  });

  const fetchPurchases = async () => {
    try {
      const response = await fetch(`${apiBaseUrl}/purchases`);
      if (!response.ok) {
        throw new Error("Failed to fetch purchases");
      }
      const data = await response.json();
      setPurchases(data);
    } catch (error) {
      console.error("Error fetching purchases:", error);
    }
  };

  useEffect(() => {
    fetchPurchases();
  }, []);

    return (
      <div className="product-container">
      <div className="product-table">
        <h2>Purchases</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Supplier</th>
              <th>App_User</th>
              <th>Status</th>
              {/* Add more table headers as needed */}
            </tr>
          </thead>
          {/* <tbody>
            {products.map((product) => (
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
        <h2>Add Purchase</h2>
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
          <button type="submit">Add Purchase</button>
        </form>
      </div> */}
    </div>
    );
  };
  
  export default Purchase;
  