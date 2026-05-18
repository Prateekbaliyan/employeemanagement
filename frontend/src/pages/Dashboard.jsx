import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { API_URL } from '../config/api';

const Dashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [searchDept, setSearchDept] = useState('');
  const { user } = useContext(AuthContext);

  const fetchEmployees = async (dept = '') => {
    try {
      const url = dept 
        ? `${API_URL}/api/employees/search?department=${dept}`
        : `${API_URL}/api/employees`;
      
      const { data } = await axios.get(url, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setEmployees(data);
    } catch (error) {
      console.error('Error fetching employees', error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchEmployees();
    }
  }, [user]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchEmployees(searchDept);
  };

  const handleClearSearch = () => {
    setSearchDept('');
    fetchEmployees('');
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await axios.delete(`${API_URL}/api/employees/${id}`, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        fetchEmployees(searchDept);
      } catch (error) {
        console.error('Error deleting employee', error);
      }
    }
  };

  const updateScore = async (id, currentScore) => {
    const newScore = prompt('Enter new performance score (0-100):', currentScore);
    if (newScore !== null && !isNaN(newScore) && newScore >= 0 && newScore <= 100) {
      try {
        await axios.put(`${API_URL}/api/employees/${id}`, { performanceScore: Number(newScore) }, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        fetchEmployees(searchDept);
      } catch (error) {
        console.error('Error updating score', error);
      }
    }
  };

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ color: 'var(--primary-blue)' }}>Employee Directory</h2>
        
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem' }}>
          <input 
            type="text" 
            placeholder="Search by Department..." 
            className="form-control"
            value={searchDept}
            onChange={(e) => setSearchDept(e.target.value)}
            style={{ width: '250px' }}
          />
          <button type="submit" className="btn-primary" style={{ width: 'auto' }}>Search</button>
          {searchDept && (
            <button type="button" onClick={handleClearSearch} className="btn-primary" style={{ width: 'auto', backgroundColor: 'var(--gray)' }}>Clear</button>
          )}
        </form>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Department</th>
            <th>Skills</th>
            <th>Score</th>
            <th>Exp. (Yrs)</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.length === 0 ? (
            <tr>
              <td colSpan="7" style={{ textAlign: 'center' }}>No employees found.</td>
            </tr>
          ) : (
            employees.map(emp => (
              <tr key={emp._id}>
                <td>{emp.name}</td>
                <td>{emp.email}</td>
                <td>{emp.department}</td>
                <td>{emp.skills.join(', ')}</td>
                <td>
                  {emp.performanceScore}
                  <button 
                    onClick={() => updateScore(emp._id, emp.performanceScore)}
                    style={{ marginLeft: '10px', fontSize: '0.8rem', padding: '2px 5px', cursor: 'pointer' }}
                  >
                    Edit
                  </button>
                </td>
                <td>{emp.experience}</td>
                <td>
                  <button 
                    onClick={() => handleDelete(emp._id)}
                    style={{ background: '#dc3545', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;
