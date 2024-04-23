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
      const idToken = localStorage.getItem('idToken');
      const response = await fetch(`${apiBaseUrl}/suppliers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${idToken}`
        },
        body: JSON.stringify(formData)
      });
      if (!response.ok) {
        throw new Error("Failed to add supplier", response);
      }
      // Reset form data
      setFormData({
        name: "",
        address: "",
        metadata: ""
      });
      // Refresh suppliers list
      fetchSuppliers();
    } catch (error) {
      console.error("Error adding supplier:", error);
    }
  };

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
              <th>Description</th>
              {/* Add more table headers as needed */}
            </tr>
          </thead>
          <tbody>
            {suppliers.map((supplier) => (
              <tr key={supplier.id}>
                <td>{supplier.id}</td>
                <td>{supplier.name}</td>
                <td>{supplier.address}</td>
                <td>{supplier.metadata}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="product-form">
        <h2>Add Supplier</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Name:</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} />
          </div>
          <div>
            <label>Address:</label>
            <input type="text" name="address" value={formData.address} onChange={handleChange} />
          </div>
          <div>
            <label>Description:</label>
            <textarea name="metadata" value={formData.metadata} onChange={handleChange} />
          </div>
          <button type="submit">Add Supplier</button>
        </form>
      </div>
    </div>
    );
  };
  
  export default Supplier;
  