import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
  requireAuth,
  validateRequest,
  BadRequestError,
  NotFoundError,
  NotAuthorizedError,
  OrderStatus,
} from '@clmicrotix/common';

import { Order } from '../models/order';
import { idText } from 'typescript';

const router = express.Router();

router.post(
  '/api/payments',
  requireAuth,
  [body('token').not().isEmpty(), body('orderId').not().isEmpty()],
  validateRequest,
  async (req: Request, res: Response) => {
    // extract token and order id from request body
    const { token, orderId } = req.body;

    // retrieve order based on orderId
    const order = await Order.findById(orderId);

    if (!order) {
      throw new NotFoundError();
    }

    // check that the requesting user has the same id as the orders userId
    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    // check that the order is not already cancelled
    if ((order.status = OrderStatus.Cancelled)) {
      throw new BadRequestError('Order is expired. Payment not allowed.');
    }

    res.send({ succes: true });
  }
);

export { router as createChargeRouter };
