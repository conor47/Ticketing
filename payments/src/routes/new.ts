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
import { stripe } from '../stripe';
import { Payment } from '../models/payment';

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
    if (order.status === OrderStatus.Cancelled) {
      throw new BadRequestError('Order is expired. Payment not allowed.');
    }

    const charge = await stripe.charges.create({
      currency: 'usd',
      amount: order.price * 100,
      source: token,
    });

    const payment = Payment.build({
      orderId,
      stripeId: charge.id,
    });
    await payment.save();

    res.status(201).send({ succes: true });
  }
);

export { router as createChargeRouter };
