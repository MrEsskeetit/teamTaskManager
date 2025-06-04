const express = require('express');
const router = express.Router();
const { createTeam } = require('../controllers/teamController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createTeam);
module.exports = router;