import { Router } from 'express';
import { getUsers, createUser, updateUser, deleteUser, getUserById } from '../controllers/UserController.js';

const router = Router();

router.get('/', getUsers);
router.get('/:id', getUserById);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);


export default router;
