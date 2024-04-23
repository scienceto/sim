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
      const response = await fetch(`${apiBaseUrl}/customers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${idToken}`
        },
        body: JSON.stringify(formData)
      });
      if (!response.ok) {
        throw new Error("Failed to add customer", response);
      }
      // Reset form data
      setFormData({
        name: "",
        address: "",
        metadata: ""
      });
      // Refresh customers list
      fetchCustomers();
    } catch (error) {
      console.error("Error adding customer:", error);
    }
  };

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
              <th>Description</th>
              {/* Add more table headers as needed */}
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id}>
                <td>{customer.id}</td>
                <td>{customer.name}</td>
                <td>{customer.address}</td>
                <td>{customer.metadata}</td>
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
          <button type="submit">Add Customer</button>
        </form>
      </div>
    </div>
    );
  };
  
  export default Customer;
  