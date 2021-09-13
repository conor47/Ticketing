import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import mongoose from 'mongoose';

import {
  NotFoundError,
  requireAuth,
  validateRequest,
  BadRequestError,
  OrderStatus,
} from '@clmicrotix/common';
import { Ticket } from '../models/ticket';
import { Order } from '../models/order';

const router = express.Router();

// for setting an orders expiration time. We are currently setting it to 15 minutes
const EXPIRATION_WINDOW_SECONDS = 15 * 60;

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
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      throw new NotFoundError();
    }
    // ensure the ticket is not already reserved

    const isReserved = await ticket.isReserved();
    if (isReserved) {
      throw new BadRequestError('Ticket is already reserved');
    }

    // Calculatedan expiration data for order
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

    // build the order and save to database
    const order = Order.build({
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      expiresAt: expiration,
      ticket,
    });

    await order.save();

    // publish an order:created event

    res.status(201).send(order);
  }
);
export { router as newOrderRouter };
