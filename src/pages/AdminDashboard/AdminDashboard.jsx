import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import AdminOverview from "../../components/AdminDashboard/AdminOverview";
import TransactionManagement from "../../components/AdminDashboard/TransactionManagement";
import CryptoManagement from "../../components/AdminDashboard/CryptoManagement";
import ReportsAnalytics from "../../components/AdminDashboard/ReportsAnalytics";

// Example User Management Component in AdminDashboard
function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    send: "",
    transfer: "",
    deposit: "",
    receive: "",
  });

  // Fetch users on initial load
  useEffect(() => {
    fetchUsers();
  }, []);

  // Function to fetch all users
  const fetchUsers = async () => {
    try {
      const response = await fetch("https://crypto-ault.onrender.com/api/auth");
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Function to handle updating user information
  const handleUpdateUser = async (userId) => {
    try {
      const response = await fetch(`https://crypto-ault.onrender.com/api/auth/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        fetchUsers(); // Refresh user list
        setIsModalOpen(false); // Close modal
      } else {
        console.error("Failed to update user.");
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  // Function to handle deleting a user
  const handleDeleteUser = async (userId) => {
    try {
      const response = await fetch(`https://crypto-ault.onrender.com/api/auth/${userId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        fetchUsers(); // Refresh user list
      } else {
        console.error("Failed to delete user.");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  // Handle opening modal to edit user
  const openModal = (user) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      send: user.send,
      transfer: user.transfer,
      deposit: user.deposit,
      receive: user.receive,
    });
    setIsModalOpen(true);
  };

  // Handle form change
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="dashboard-container">
  <aside className="sidebar" style={{ backgroundColor: '#333', padding: '15px' }}>
    <ul style={{ listStyleType: 'none', padding: 0 }}>
        <li style={{ margin: '10px 0' }}>
            <Link to="/overview" style={{ color: 'white', textDecoration: 'none' }}>Overview</Link>
        </li>
        <li style={{ margin: '10px 0' }}>
            <Link to="/users" style={{ color: 'white', textDecoration: 'none' }}>Users</Link>
        </li>
        <li style={{ margin: '10px 0' }}>
            <Link to="/transactions" style={{ color: 'white', textDecoration: 'none' }}>Transactions</Link>
        </li>
        <li style={{ margin: '10px 0' }}>
            <Link to="/cryptos" style={{ color: 'white', textDecoration: 'none' }}>Cryptos</Link>
        </li>
        <li style={{ margin: '10px 0' }}>
            <Link to="/reports" style={{ color: 'white', textDecoration: 'none' }}>Reports</Link>
        </li>
    </ul>
</aside>
      <main className="dashboard-main">

            {/* User Management Table */}
            <div>
              <h2>User Management</h2>
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Send</th>
                    <th>Transfer</th>
                    <th>Deposit</th>
                    <th>Receive</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.send}</td>
                      <td>{user.transfer}</td>
                      <td>{user.deposit}</td>
                      <td>{user.receive}</td>
                      <td>
  <button 
    style={{
      padding: '10px 15px',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      fontSize: '16px',
      backgroundColor: '#4CAF50', // Green
      color: 'white',
      transition: 'background-color 0.3s ease'
    }} 
    onClick={() => openModal(user)}
    onMouseOver={(e) => e.currentTarget.style.filter = 'brightness(90%)'}
    onMouseOut={(e) => e.currentTarget.style.filter = 'none'}>
    Edit
  </button>
  <button 
    style={{
      padding: '10px 15px',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      fontSize: '16px',
      backgroundColor: '#f44336', // Red
      color: 'white',
      transition: 'background-color 0.3s ease'
    }} 
    onClick={() => handleDeleteUser(user._id)}
    onMouseOver={(e) => e.currentTarget.style.filter = 'brightness(90%)'}
    onMouseOut={(e) => e.currentTarget.style.filter = 'none'}>
    Delete
  </button>
</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Modal for Updating User */}
              {isModalOpen && (
                <div className="modal">
                  <h3>Edit User</h3>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleUpdateUser(selectedUser._id);
                    }}
                  >
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleFormChange}
                      placeholder="Name"
                    />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleFormChange}
                      placeholder="Email"
                    />
                    <input
                      type="number"
                      name="send"
                      value={formData.send}
                      onChange={handleFormChange}
                      placeholder="Send"
                    />
                    <input
                      type="number"
                      name="transfer"
                      value={formData.transfer}
                      onChange={handleFormChange}
                      placeholder="Transfer"
                    />
                    <input
                      type="number"
                      name="deposit"
                      value={formData.deposit}
                      onChange={handleFormChange}
                      placeholder="Deposit"
                    />
                    <input
                      type="number"
                      name="receive"
                      value={formData.receive}
                      onChange={handleFormChange}
                      placeholder="Receive"
                    />
                    <button type="submit">Update</button>
                    <button type="button" onClick={closeModal}>
                      Cancel
                    </button>
                  </form>
                </div>
              )}
            </div>
       
      </main>
    </div>
  );
}

export default AdminDashboard;
