const express = require('express');

const { createUser, loginUser, getMe, deleteUser, logoutUser, getUsers, updateUser } = require('../controllers/userController');
const User = require('../database/models/User');
const { requireAuth } = require('../middleware/authMiddleware');
const { paginate } = require('../middleware/paginationMiddleware');

const router = express.Router();

router.get('/', requireAuth(), paginate(User, ['school']), getUsers);

router.get('/me', requireAuth(), getMe);

router.post('/', createUser);

router.post('/login', loginUser);

router.post('/logout', requireAuth(), logoutUser);

router.patch('/:id', requireAuth(), updateUser);

router.delete('/:id', requireAuth(), deleteUser);

module.exports = router;