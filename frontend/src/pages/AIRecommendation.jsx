import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { API_URL } from '../config/api';

const AIRecommendation = () => {
  const [employees, setEmployees] = useState([]);
  const [taskType, setTaskType] = useState('Promotion Recommendation');
  const [recommendation, setRecommendation] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      const fetchEmployees = async () => {
        try {
          const { data } = await axios.get(`${API_URL}/api/employees`, {
            headers: { Authorization: `Bearer ${user.token}` }
          });
          setEmployees(data);
        } catch (error) {
          console.error('Error fetching employees', error);
        }
      };
      fetchEmployees();
    }
  }, [user]);

  const handleGenerate = async () => {
    if (employees.length === 0) {
      alert('No employees data available to analyze.');
      return;
    }
    
    setLoading(true);
    setRecommendation('');
    
    try {
      const { data } = await axios.post(`${API_URL}/api/ai/recommend`, 
        { employees, taskType },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setRecommendation(data.recommendation);
    } catch (error) {
      console.error('Error generating AI recommendation', error);
      const backendError = error.response?.data?.message || error.message;
      setRecommendation(`Failed to generate recommendation.\nReason: ${backendError}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="form-container" style={{ maxWidth: '800px' }}>
        <h2 style={{ color: 'var(--primary-blue)' }}>AI Recommendations & Feedback</h2>
        <p>Select a task to generate AI-driven insights based on the current employee data.</p>
        
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
          <select 
            className="form-control" 
            value={taskType} 
            onChange={(e) => setTaskType(e.target.value)}
            style={{ flex: 1 }}
          >
            <option value="Promotion Recommendation">Promotion Recommendation</option>
            <option value="Employee Ranking">Employee Ranking</option>
            <option value="Training Suggestions">Training Suggestions</option>
            <option value="AI Feedback Generation">AI Feedback Generation</option>
          </select>
          <button 
            className="btn-primary" 
            onClick={handleGenerate} 
            disabled={loading}
            style={{ width: '200px' }}
          >
            {loading ? 'Generating...' : 'Generate Insights'}
          </button>
        </div>

        {recommendation && (
          <div className="ai-card">
            <h3 style={{ marginTop: 0, color: 'var(--primary-blue)' }}>Results for: {taskType}</h3>
            <pre>{recommendation}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIRecommendation;
