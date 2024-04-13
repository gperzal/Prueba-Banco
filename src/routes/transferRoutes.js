// transferRoutes.js
import { Router } from 'express';
import { createTransfer, getTransfers, getSentTransfersByUserId, getReceivedTransfersByUserId } from '../controllers/TransferController.js';

const router = Router();

router.post('/api/transfers', createTransfer);
router.get('/api/transfers', getTransfers);
router.get('/api/transfers/:id/sent', getSentTransfersByUserId);
router.get('/api/transfers/:id/received', getReceivedTransfersByUserId);


export default router;
