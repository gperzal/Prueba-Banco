// transferRoutes.js
import { Router } from 'express';
import { createTransfer, getTransfers, getSentTransfersByUserId, getReceivedTransfersByUserId } from '../controllers/TransferController.js';

const router = Router();

router.post('/', createTransfer);
router.get('/', getTransfers);
router.get('/:id/sent', getSentTransfersByUserId);
router.get('/:id/received', getReceivedTransfersByUserId);


export default router;
