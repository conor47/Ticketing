import express, { Request, Response } from 'express';
import { requireAuth, validateRequest } from '@clmicrotix/common';
import { body } from 'express-validator';
import mongoose from 'mongoose';

const router = express.Router();

router.post(
  '/api/orders',
  requireAuth,
  [
    body('ticketId')
      .not()
      .isEmpty()
      // we are checking that the user provides a valid mongo Id. Note this introduces some subtle coupling between the orders and tickets services
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage('TicketId must not be empty'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    res.send({});
  }
);

export { router as newOrderRouter };
