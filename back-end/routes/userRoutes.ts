import express from 'express';
import {registerUser, loginUser, getAllUsers, deleteUser, getTheUserLoggedInInfo, updateUser, updateWaterIntake} from '../controllers/UsersControllers';
import {MiddlewareAuth} from '../middlewares/MiddleWareAuth';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/', getAllUsers);
router.delete('/', deleteUser);
router.get('/logged', MiddlewareAuth, getTheUserLoggedInInfo);
router.put('/', MiddlewareAuth, updateUser);
router.put('/waterIntake', MiddlewareAuth, updateWaterIntake);
module.exports = router;