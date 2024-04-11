import express from 'express';
import { getTransfer, createTrans } from './controllers/transferController.js';

const router = express.Router();

router.get('/transfer', getTransfer);
router.post('/transfer', createTrans);


app.use('/api', router);
