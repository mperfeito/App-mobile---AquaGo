import express from 'express';
import {registerUser, loginUser, getAllUsers, deleteUser, registerMissingInfo, getTheUserLoggedInInfo} from '../controllers/UsersControllers';
import {MiddlewareAuth} from '../middlewares/MiddleWareAuth';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/', getAllUsers);
router.delete('/', deleteUser);
router.post('/', MiddlewareAuth, registerMissingInfo);
router.get('/logged', MiddlewareAuth, getTheUserLoggedInInfo);

module.exports = router;