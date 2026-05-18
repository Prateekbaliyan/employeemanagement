const axios = require('axios');

const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || 'openrouter/free';

// @desc    Get AI Recommendation
// @route   POST /api/ai/recommend
// @access  Private
exports.getRecommendation = async (req, res) => {
  try {
    const { employees, taskType } = req.body;
    
    if (!employees || employees.length === 0) {
      return res.status(400).json({ message: 'Please provide employee data' });
    }

    if (!taskType) {
      return res.status(400).json({ message: 'Please provide a taskType (e.g., Promotion Recommendation)' });
    }

    const systemPrompt = `You are an expert HR AI assistant. Your task is to analyze employee data and provide insights based on the requested task type. Please return the output in a structured, readable markdown format.`;
    
    const userPrompt = `
Task Type: ${taskType}

Employee Data:
${JSON.stringify(employees, null, 2)}

Please provide a detailed response for the given task type based on the provided employee data. Be specific and reference the employees' performance scores, experience, and skills where relevant.
    `;

    // Support OpenRouter / OpenAI
    const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
      model: OPENROUTER_MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ]
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost:5173',
        'X-Title': 'Employee Performance App'
      }
    });

    const aiMessage = response.data.choices[0].message.content;

    res.json({ recommendation: aiMessage });
  } catch (error) {
    const errorMsg = error.response && error.response.data && error.response.data.error 
      ? error.response.data.error.message || JSON.stringify(error.response.data.error)
      : error.message;
    console.error('AI API Error:', errorMsg);
    res.status(500).json({ message: `AI Error: ${errorMsg}` });
  }
};
