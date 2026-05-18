import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { API_URL } from '../config/api';

const AddEmployee = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    skills: '', // we will split this into an array
    performanceScore: '',
    experience: ''
  });
  const [error, setError] = useState('');
  
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const skillsArray = formData.skills.split(',').map(s => s.trim()).filter(s => s !== '');
      
      const employeeData = {
        ...formData,
        skills: skillsArray,
        performanceScore: Number(formData.performanceScore),
        experience: Number(formData.experience)
      };

      await axios.post(`${API_URL}/api/employees`, employeeData, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.errors?.join(', ') || 'Failed to add employee');
    }
  };

  return (
    <div className="container">
      <div className="form-container">
        <h2 style={{ textAlign: 'center', color: 'var(--primary-blue)' }}>Add New Employee</h2>
        {error && <div className="error-msg">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input type="text" name="name" className="form-control" value={formData.name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" className="form-control" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Department</label>
            <input type="text" name="department" className="form-control" value={formData.department} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Skills (comma separated)</label>
            <input type="text" name="skills" className="form-control" placeholder="React, Node.js, MongoDB" value={formData.skills} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Performance Score (0-100)</label>
            <input type="number" name="performanceScore" min="0" max="100" className="form-control" value={formData.performanceScore} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Years of Experience</label>
            <input type="number" name="experience" min="0" className="form-control" value={formData.experience} onChange={handleChange} required />
          </div>
          <button type="submit" className="btn-primary">Add Employee</button>
        </form>
      </div>
    </div>
  );
};

export default AddEmployee;
