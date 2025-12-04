import express from 'express';
import {registerUser, loginUser, getAllUsers, deleteUser, registerMissingInfo} from '../controllers/UsersControllers';
import {MiddlewareAuth} from '../middlewares/MiddleWareAuth';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/', getAllUsers);
router.delete('/', deleteUser);
router.post('/', MiddlewareAuth, registerMissingInfo)

module.exports = router;