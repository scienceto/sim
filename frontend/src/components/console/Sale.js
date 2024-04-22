import { useState, useEffect } from "react";
import { apiBaseUrl } from "../../config";

const Sale = () => {
  const [sales, setSales] = useState([]);
  const [formData, setFormData] = useState({
    customer: "",
    app_user: "",
    status: ""
  });

  const fetchSales = async () => {
    try {
      const response = await fetch(`${apiBaseUrl}/sales`);
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      const data = await response.json();
      setSales(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

    return (
      <div className="product-container">
      <div className="product-table">
        <h2>Sales</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Customer</th>
              <th>App_User</th>
              <th>Status</th>
              {/* Add more table headers as needed */}
            </tr>
          </thead>
          {/* <tbody>
            {sale.map((product) => (
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
        <h2>Add Sales</h2>
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
          <button type="submit">Add Sale</button>
        </form>
      </div> */}
    </div>
    );
  };
  
  export default Sale;
  