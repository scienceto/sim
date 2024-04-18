import { useState, useEffect } from "react";
import { apiBaseUrl } from "../../config";

const Product = () => {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: ""
  });

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${apiBaseUrl}/products`);
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${apiBaseUrl}/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });
      if (!response.ok) {
        throw new Error("Failed to add product");
      }
      // Reset form data
      setFormData({
        name: "",
        category: "",
        description: ""
      });
      // Refresh product list
      fetchProducts();
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  return (
    <div className="product-container">
      <div className="product-table">
        <h2>Products</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Category</th>
              <th>Description</th>
              {/* Add more table headers as needed */}
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>{product.name}</td>
                <td>{product.category}</td>
                <td>{product.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="product-form">
        <h2>Add Product</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Name:</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} />
          </div>
          <div>
            <label>Category:</label>
            <input type="text" name="category" value={formData.category} onChange={handleChange} />
          </div>
          <div>
            <label>Description:</label>
            <textarea name="description" value={formData.description} onChange={handleChange} />
          </div>
          <button type="submit">Add Product</button>
        </form>
      </div>
    </div>
  );
};

export default Product;
