import { Router } from 'express';
import { getUsers, createUser, updateUser, deleteUser, getUserById } from '../controllers/UserController.js';

const router = Router();

router.get('/api/users', getUsers);
router.get('/api/users/:id', getUserById);
router.post('/api/users', createUser);
router.put('/api/users/:id', updateUser);
router.delete('/api/users/:id', deleteUser);


export default router;
