const express = require('express');
const router = express.Router();
const {
  getEmployees,
  searchEmployees,
  addEmployee,
  updateEmployee,
  deleteEmployee
} = require('../controllers/employeeController');
const { protect } = require('../middleware/auth');

// Apply protect middleware to all routes
router.use(protect);

router.route('/')
  .get(getEmployees)
  .post(addEmployee);

router.get('/search', searchEmployees);

router.route('/:id')
  .put(updateEmployee)
  .delete(deleteEmployee);

module.exports = router;
