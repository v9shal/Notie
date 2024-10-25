const express = require('express');
const { register,login } = require('../controllers/authController');
const { protect,isLogin } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login',login)
router.get('/islogin',isLogin)
module.exports = router;