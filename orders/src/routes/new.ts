import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import mongoose from 'mongoose';

import {
  NotFoundError,
  requireAuth,
  validateRequest,
  OrderStatus,
  BadRequestError,
} from '@clmicrotix/common';
import { Ticket } from '../models/ticket';
import { Order } from '../models/order';

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
    const { ticketId } = req.body;

    // find ticket that the user is trying to order
    const ticket = await Ticket.findById({ ticketId });
    if (!ticket) {
      throw new NotFoundError();
    }
    // ensure the ticket is not already reserved
    const existingOrder = await Order.findOne({
      ticket: ,
      status: {
        $in: [
          OrderStatus.Complete,
          OrderStatus.AwaitingPayment,
          OrderStatus.Created,
        ],
      },
    });

    if (existingOrder) {
      throw new BadRequestError('Ticket is already reserved');
    }

    // Calculatedan expiration data for order

    // build the order and save to database

    // publish an order:created event

    res.send({});
  }
);

export { router as newOrderRouter };
